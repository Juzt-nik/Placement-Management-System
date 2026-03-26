const opportunityService = require("../services/opportunityService");

const getOpportunities = async (req, res) => {
  try {
    const data = await opportunityService.getAllOpportunities();
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getOpportunity = async (req, res) => {
  try {
    const data = await opportunityService.getOpportunityById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const addOpportunity = async (req, res) => {
  try {
    await opportunityService.createOpportunity(req.body);
    res.status(201).json({ message: "Opportunity created successfully" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const editOpportunity = async (req, res) => {
  try {
    await opportunityService.updateOpportunity(req.params.id, req.body);
    res.json({ message: "Opportunity updated successfully" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const removeOpportunity = async (req, res) => {
  try {
    await opportunityService.deleteOpportunity(req.params.id);
    res.json({ message: "Opportunity deleted successfully" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getOpportunities, getOpportunity, addOpportunity, editOpportunity, removeOpportunity };
