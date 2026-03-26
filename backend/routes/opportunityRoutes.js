const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/opportunityController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// All authenticated users can view opportunities (students need to browse them)
router.get("/", verifyToken, ctrl.getOpportunities);
router.get("/:id", verifyToken, ctrl.getOpportunity);

// Only officer/admin can create, edit, delete
router.post("/", verifyToken, authorizeRoles("admin", "placement_officer"), ctrl.addOpportunity);
router.put("/:id", verifyToken, authorizeRoles("admin", "placement_officer"), ctrl.editOpportunity);
router.delete("/:id", verifyToken, authorizeRoles("admin", "placement_officer"), ctrl.removeOpportunity);

module.exports = router;
