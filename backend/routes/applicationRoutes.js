const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/applicationController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

// Student gets their own applications — must come BEFORE /:id
router.get("/my", verifyToken, authorizeRoles("student"), ctrl.getMyApplications);

// Staff gets all applications
router.get("/", verifyToken, authorizeRoles("admin", "placement_officer", "faculty", "hod"), ctrl.getApplications);

// Officer adds round / selects student
router.post("/:id/round", verifyToken, authorizeRoles("placement_officer", "admin"), ctrl.addRoundToApplication);
router.put("/:id/select", verifyToken, authorizeRoles("placement_officer", "admin"), ctrl.markApplicationSelected);

// Get single application
router.get("/:id", verifyToken, ctrl.getApplication);

// Student applies
router.post("/",
  verifyToken,
  authorizeRoles("student"),
  [
    body("student_id").isInt().withMessage("Valid student ID required"),
    body("opportunity_id").isInt().withMessage("Valid opportunity ID required")
  ],
  validate,
  ctrl.addApplication
);

// Admin deletes
router.delete("/:id", verifyToken, authorizeRoles("admin"), ctrl.removeApplication);

module.exports = router;
