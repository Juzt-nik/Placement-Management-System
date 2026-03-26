const db = require("../config/db");

// Get all Students
const getAllStudents = () => new Promise((resolve, reject) => {
  db.query("SELECT * FROM Student", (err, results) => err ? reject(err) : resolve(results));
});

// Get Student By ID
const getStudentById = (id) => new Promise((resolve, reject) => {
  db.query("SELECT * FROM Student WHERE student_id = ?", [id], (err, results) =>
    err ? reject(err) : resolve(results[0]));
});

// Get full student profile — student info + all applications with rounds
const getStudentProfile = (id) => new Promise((resolve, reject) => {
  // 1. Get student details
  db.query("SELECT * FROM Student WHERE student_id = ?", [id], (err, students) => {
    if (err) return reject(err);
    if (!students.length) return reject(new Error("Student not found"));
    const student = students[0];

    // 2. Get all applications with company + role info
    const appQuery = `
      SELECT
        a.application_id, a.opportunity_id, a.status, a.current_round, a.application_date,
        op.role_title, op.job_type, op.drive_type, op.stipend_or_ctc, op.mode,
        o.organization_id, o.organization_name, o.organization_type, o.location
      FROM application a
      JOIN opportunity op ON a.opportunity_id = op.opportunity_id
      JOIN Organization o ON op.organization_id = o.organization_id
      WHERE a.student_id = ?
      ORDER BY a.application_date DESC
    `;

    db.query(appQuery, [id], (err2, apps) => {
      if (err2) return reject(err2);
      if (!apps.length) return resolve({ ...student, applications: [] });

      // 3. Get all rounds for these applications
      const appIds = apps.map(a => a.application_id);
      const roundQuery = `
        SELECT * FROM application_round
        WHERE application_id IN (${appIds.map(() => '?').join(',')})
        ORDER BY application_id, round_number
      `;

      db.query(roundQuery, appIds, (err3, rounds) => {
        if (err3) return reject(err3);

        // Attach rounds to their applications
        const roundsByApp = {};
        rounds.forEach(r => {
          if (!roundsByApp[r.application_id]) roundsByApp[r.application_id] = [];
          roundsByApp[r.application_id].push(r);
        });

        const appsWithRounds = apps.map(a => ({
          ...a,
          rounds: roundsByApp[a.application_id] || []
        }));

        resolve({ ...student, applications: appsWithRounds });
      });
    });
  });
});

// Create Student (officer creates — student activates later)
const { v4: uuidv4 } = require("uuid");
const createStudent = (data) => new Promise((resolve, reject) => {
  const token = uuidv4();
  const query = `
    INSERT INTO Student (register_number, email, registration_token, profile_status, is_active)
    VALUES (?, ?, ?, 'Pending', FALSE)
  `;
  db.query(query, [data.register_number, data.email, token], (err, result) =>
    err ? reject(err) : resolve({ result, token }));
});

// Update Student
const updateStudent = (id, data) => new Promise((resolve, reject) => {
  const query = `
    UPDATE Student SET
    name=?, department=?, year_of_study=?, cgpa=?, email=?, phone=?, resume_link=?, skill_set=?
    WHERE student_id=?
  `;
  db.query(query, [
    data.name, data.department, data.year_of_study, data.cgpa,
    data.email, data.phone, data.resume_link, data.skill_set, id
  ], (err, result) => err ? reject(err) : resolve(result));
});

// Delete Student
const deleteStudent = (id) => new Promise((resolve, reject) => {
  db.query("DELETE FROM Student WHERE student_id=?", [id],
    (err, result) => err ? reject(err) : resolve(result));
});

module.exports = { getAllStudents, getStudentById, getStudentProfile, createStudent, updateStudent, deleteStudent };
