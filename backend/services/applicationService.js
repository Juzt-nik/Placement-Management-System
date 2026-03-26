const db = require("../config/db");

// Get all applications (staff view)
const getAllApplications = () => new Promise((resolve, reject) => {
  const q = `
    SELECT
      a.application_id, a.student_id, s.name AS student_name,
      a.opportunity_id, o.organization_name, op.role_title, op.job_type,
      a.status, a.current_round, a.application_date
    FROM application a
    JOIN Student s ON a.student_id = s.student_id
    JOIN opportunity op ON a.opportunity_id = op.opportunity_id
    JOIN Organization o ON op.organization_id = o.organization_id
    ORDER BY a.application_date DESC
  `;
  db.query(q, (err, rows) => err ? reject(err) : resolve(rows));
});

// Get applications for a specific student
const getApplicationsByStudentId = (student_id) => new Promise((resolve, reject) => {
  const q = `
    SELECT
      a.application_id, a.student_id, a.opportunity_id,
      o.organization_name, op.role_title, op.job_type, op.stipend_or_ctc,
      op.mode, op.location,
      a.status, a.current_round, a.application_date
    FROM application a
    JOIN opportunity op ON a.opportunity_id = op.opportunity_id
    JOIN Organization o ON op.organization_id = o.organization_id
    WHERE a.student_id = ?
    ORDER BY a.application_date DESC
  `;
  db.query(q, [student_id], (err, rows) => err ? reject(err) : resolve(rows));
});

const getApplicationById = (id) => new Promise((resolve, reject) => {
  db.query("SELECT * FROM application WHERE application_id=?", [id],
    (err, rows) => err ? reject(err) : resolve(rows[0]));
});

// Student applies (prevents duplicates)
const createApplication = (student_id, opportunity_id) => new Promise((resolve, reject) => {
  db.query(
    "SELECT * FROM application WHERE student_id=? AND opportunity_id=?",
    [student_id, opportunity_id],
    (err, rows) => {
      if (err) return reject(err);
      if (rows.length > 0) return reject(new Error("Already applied to this opportunity"));
      db.query(
        "INSERT INTO application (student_id, opportunity_id) VALUES (?,?)",
        [student_id, opportunity_id],
        (err2, result) => err2 ? reject(err2) : resolve(result)
      );
    }
  );
});

const deleteApplication = (id) => new Promise((resolve, reject) => {
  db.query("DELETE FROM application WHERE application_id=?", [id],
    (err, result) => err ? reject(err) : resolve(result));
});

// Add interview round
const addRound = (application_id, round_number, round_name, round_date) => new Promise((resolve, reject) => {
  db.query("SELECT * FROM application WHERE application_id=?", [application_id], (err, rows) => {
    if (err) return reject(err);
    if (!rows.length) return reject(new Error("Application not found"));

    db.query(
      "INSERT INTO application_round (application_id, round_number, round_name, round_date) VALUES (?,?,?,?)",
      [application_id, round_number, round_name, round_date],
      (err2) => {
        if (err2) return reject(err2);
        db.query(
          "UPDATE application SET current_round=?, status='In Process' WHERE application_id=?",
          [round_number, application_id],
          (err3) => err3 ? reject(err3) : resolve()
        );
      }
    );
  });
});

// Mark selected → auto-create Placement or Internship record + update student
const markAsSelected = (application_id) => new Promise((resolve, reject) => {
  // 1. Get full application + opportunity details
  const q = `
    SELECT a.*, op.job_type, op.role_title, op.organization_id,
           op.stipend_or_ctc, op.duration_months, op.mode,
           op.start_date, op.end_date
    FROM application a
    JOIN opportunity op ON a.opportunity_id = op.opportunity_id
    WHERE a.application_id = ?
  `;
  db.query(q, [application_id], (err, rows) => {
    if (err) return reject(err);
    if (!rows.length) return reject(new Error("Application not found"));
    const app = rows[0];

    // 2. Mark application as Selected
    db.query(
      "UPDATE application SET status='Selected' WHERE application_id=?",
      [application_id],
      (err2) => {
        if (err2) return reject(err2);

        // 3. Update Student placement_status
        db.query(
          "UPDATE Student SET placement_status='Placed' WHERE student_id=?",
          [app.student_id],
          (err3) => {
            if (err3) return reject(err3);

            // 4a. If Placement → insert into Placement table
            if (app.job_type === 'Placement') {
              const pq = `
                INSERT INTO Placement (student_id, organization_id, job_role, package_lpa, offer_type, offer_date)
                VALUES (?, ?, ?, ?, 'Full Time', CURDATE())
              `;
              db.query(pq, [
                app.student_id, app.organization_id, app.role_title,
                app.stipend_or_ctc || 0
              ], (err4) => {
                if (err4) console.warn("Placement insert warn:", err4.message);
                resolve("Student marked as selected. Placement record created.");
              });

            // 4b. If Internship → insert into Internship table
            } else if (app.job_type === 'Internship') {
              const iq = `
                INSERT INTO Internship
                (student_id, organization_id, internship_domain, start_date, end_date,
                 duration_months, mode, stipend, internship_status, certificate_submitted)
                VALUES (?,?,?,?,?,?,?,?,'Ongoing',0)
              `;
              db.query(iq, [
                app.student_id, app.organization_id, app.role_title,
                app.start_date || null, app.end_date || null,
                app.duration_months || null, app.mode || 'On-site',
                app.stipend_or_ctc || 0
              ], (err4) => {
                if (err4) console.warn("Internship insert warn:", err4.message);
                resolve("Student marked as selected. Internship record created.");
              });

            } else {
              resolve("Student marked as selected.");
            }
          }
        );
      }
    );
  });
});

module.exports = {
  getAllApplications, getApplicationsByStudentId,
  getApplicationById, createApplication, deleteApplication,
  addRound, markAsSelected
};
