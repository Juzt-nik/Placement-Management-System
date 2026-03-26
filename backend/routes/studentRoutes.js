const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

// GET all students
router.get("/", verifyToken, studentController.getStudents);

// GET full student profile with application history — NEW
router.get("/:id/profile", verifyToken,
  authorizeRoles("admin", "placement_officer", "faculty", "hod"),
  studentController.getStudentProfile
);

// Verify student
router.put("/:id/verify", verifyToken,
  authorizeRoles("faculty", "hod", "placement_officer"),
  studentController.verifyStudent
);

// GET single student
router.get("/:id", verifyToken, studentController.getStudent);

// CREATE student
router.post("/", verifyToken,
  authorizeRoles("hod", "placement_officer"),
  [
    body("register_number").notEmpty().withMessage("Register number required"),
    body("email").isEmail().withMessage("Valid email required")
  ],
  validate,
  studentController.addStudent
);

// UPDATE student
router.put("/:id", verifyToken, studentController.editStudent);

// DELETE student
router.delete("/:id", verifyToken, authorizeRoles("admin"), studentController.removeStudent);

// ACTIVATE (no auth — student uses token)
router.post("/activate", studentController.activateStudent);

module.exports = router;
