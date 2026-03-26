const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");
const db = require("../config/db");

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

const register = async (req, res) => {
  const { username, password, role, student_id } = req.body;
  try {
    if (!username || !password || !role)
      return res.status(400).json({ message: "All fields are required" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await authService.createUser(username, hashedPassword, role, student_id);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authService.findUserByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.is_active)
      return res.status(403).json({ message: "Account not verified yet." });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, student_id: user.student_id || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────
// OFFICER PROFILE  (table: officer_profiles)
// ─────────────────────────────────────────────

const getOfficerProfile = (req, res) => {
  const userId = req.user.user_id;

  db.query(
    "SELECT * FROM officer_profiles WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ getOfficerProfile error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.json({
          user_id: userId,
          name: "", email: "", phone: "",
          employee_id: "", designation: "", department: "",
          linkedin_url: "", profile_completed: false,
        });
      }

      const p = rows[0];
      res.json({ ...p, profile_completed: !!p.profile_completed });
    }
  );
};

const updateOfficerProfile = (req, res) => {
  const userId = req.user.user_id;
  const { name, email, phone, employee_id, designation, department, linkedin_url } = req.body;

  console.log("📥 updateOfficerProfile called for user_id:", userId, "| body:", req.body);

  if (!name || !email || !designation)
    return res.status(400).json({ error: "Name, email, and designation are required." });

  const isComplete = (name && email && designation && department) ? 1 : 0;

  const sql = `
    INSERT INTO officer_profiles
      (user_id, name, email, phone, employee_id, designation, department, linkedin_url, profile_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name              = VALUES(name),
      email             = VALUES(email),
      phone             = VALUES(phone),
      employee_id       = VALUES(employee_id),
      designation       = VALUES(designation),
      department        = VALUES(department),
      linkedin_url      = VALUES(linkedin_url),
      profile_completed = VALUES(profile_completed)
  `;

  const values = [
    userId, name, email,
    phone || null, employee_id || null,
    designation, department || null,
    linkedin_url || null, isComplete
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ updateOfficerProfile error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Officer profile saved for user_id:", userId);
    res.json({ message: "Profile updated successfully", profile_completed: !!isComplete });
  });
};

// ─────────────────────────────────────────────
// FACULTY PROFILE  (table: faculty_profiles)
// ─────────────────────────────────────────────

const getFacultyProfile = (req, res) => {
  const userId = req.user.user_id;

  db.query(
    "SELECT * FROM faculty_profiles WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ getFacultyProfile error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.json({
          user_id: userId,
          name: "", email: "", phone: "",
          employee_id: "", designation: "", department: "",
          linkedin_url: "", profile_completed: false,
        });
      }

      const p = rows[0];
      res.json({ ...p, profile_completed: !!p.profile_completed });
    }
  );
};

const updateFacultyProfile = (req, res) => {
  const userId = req.user.user_id;
  const { name, email, phone, employee_id, designation, department, linkedin_url } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required." });

  const isComplete = (name && email && designation && department) ? 1 : 0;

  const sql = `
    INSERT INTO faculty_profiles
      (user_id, name, email, phone, employee_id, designation, department, linkedin_url, profile_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name              = VALUES(name),
      email             = VALUES(email),
      phone             = VALUES(phone),
      employee_id       = VALUES(employee_id),
      designation       = VALUES(designation),
      department        = VALUES(department),
      linkedin_url      = VALUES(linkedin_url),
      profile_completed = VALUES(profile_completed)
  `;

  db.query(
    sql,
    [userId, name, email, phone || null, employee_id || null,
     designation || null, department || null, linkedin_url || null, isComplete],
    (err) => {
      if (err) {
        console.error("❌ updateFacultyProfile error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Profile updated successfully", profile_completed: !!isComplete });
    }
  );
};

module.exports = {
  register,
  login,
  getOfficerProfile,
  updateOfficerProfile,
  getFacultyProfile,
  updateFacultyProfile,
};