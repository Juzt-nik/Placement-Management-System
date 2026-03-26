const applicationService = require("../services/applicationService");

const getApplications = async (req, res) => {
  try {
    const data = await applicationService.getAllApplications();
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// NEW: student gets only their own applications
const getMyApplications = async (req, res) => {
  try {
    const student_id = req.user.student_id;
    if (!student_id) return res.status(400).json({ message: "No student_id on token" });
    const data = await applicationService.getApplicationsByStudentId(student_id);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getApplication = async (req, res) => {
  try {
    const data = await applicationService.getApplicationById(req.params.id);
    if (!data) return res.status(404).json({ message: "Application not found" });
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const addApplication = async (req, res) => {
  try {
    const { student_id, opportunity_id } = req.body;
    if (!student_id || !opportunity_id)
      return res.status(400).json({ message: "student_id and opportunity_id required" });
    await applicationService.createApplication(student_id, opportunity_id);
    res.status(201).json({ message: "Applied successfully" });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const removeApplication = async (req, res) => {
  try {
    await applicationService.deleteApplication(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const addRoundToApplication = async (req, res) => {
  try {
    const { round_number, round_name, round_date } = req.body;
    if (!round_number || !round_name || !round_date)
      return res.status(400).json({ message: "All round fields required" });
    await applicationService.addRound(req.params.id, round_number, round_name, round_date);
    res.status(201).json({ message: "Round added successfully" });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const markApplicationSelected = async (req, res) => {
  try {
    const message = await applicationService.markAsSelected(req.params.id);
    res.json({ message });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

module.exports = {
  getApplications, getMyApplications, getApplication,
  addApplication, removeApplication,
  addRoundToApplication, markApplicationSelected
};
