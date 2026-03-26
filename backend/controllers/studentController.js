const studentService = require("../services/studentService");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getStudent = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// NEW: full profile with application history
const getStudentProfile = async (req, res) => {
  try {
    const profile = await studentService.getStudentProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    if (error.message === "Student not found") return res.status(404).json({ message: error.message });
    res.status(500).json({ error: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const response = await studentService.createStudent(req.body);
    res.status(201).json({ message: "Student shell created successfully", registration_token: response.token });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const editStudent = async (req, res) => {
  try {
    await studentService.updateStudent(req.params.id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const removeStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const activateStudent = async (req, res) => {
  try {
    const { registration_token, password } = req.body;
    if (!registration_token || !password)
      return res.status(400).json({ message: "Token and password required" });

    db.query("SELECT * FROM student WHERE registration_token = ?", [registration_token], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(400).json({ message: "Invalid token. Please check with your Placement Officer." });

      const student = results[0];

      // Check if already activated (token already used)
      db.query("SELECT user_id FROM users WHERE student_id = ?", [student.student_id], async (err1, existing) => {
        if (err1) return res.status(500).json({ error: err1.message });
        if (existing.length > 0) {
          return res.status(400).json({ message: "This account has already been activated. Please login instead." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // is_active = FALSE — student must be verified by officer before login is allowed
        db.query(
          `INSERT INTO users (username, password, role, student_id, is_active) VALUES (?, ?, 'student', ?, FALSE)`,
          [student.email, hashedPassword, student.student_id],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // Clear token and mark profile as Submitted
            db.query(
              `UPDATE student SET profile_status = 'Submitted', registration_token = NULL WHERE student_id = ?`,
              [student.student_id]
            );

            res.json({ message: "Account activated. Awaiting verification by Placement Officer." });
          }
        );
      });
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const verifyStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    db.query("SELECT * FROM student WHERE student_id=?", [studentId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ message: "Student not found" });

      db.query("UPDATE student SET profile_status='Verified' WHERE student_id=?", [studentId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        db.query("UPDATE users SET is_active=1 WHERE student_id=?", [studentId], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "Student verified successfully." });
        });
      });
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  getStudents, getStudent, getStudentProfile,
  addStudent, editStudent, removeStudent,
  activateStudent, verifyStudent
};