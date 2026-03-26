const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/register", authController.register);
router.post("/login",    authController.login);

// ── Officer profile ──────────────────────────────────────────
router.get(
  "/profile/officer",
  verifyToken,
  authorizeRoles("placement_officer", "admin"),
  authController.getOfficerProfile
);
router.put(
  "/profile/officer",
  verifyToken,
  authorizeRoles("placement_officer", "admin"),
  authController.updateOfficerProfile
);

// ── Faculty profile ──────────────────────────────────────────
router.get(
  "/profile/faculty",
  verifyToken,
  authorizeRoles("faculty", "hod"),
  authController.getFacultyProfile
);
router.put(
  "/profile/faculty",
  verifyToken,
  authorizeRoles("faculty", "hod"),
  authController.updateFacultyProfile
);

module.exports = router;