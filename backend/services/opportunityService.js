const db = require("../config/db");

const getAllOpportunities = () => new Promise((resolve, reject) => {
  const q = `
    SELECT op.*, o.organization_name, o.location AS org_location
    FROM opportunity op
    JOIN Organization o ON op.organization_id = o.organization_id
    ORDER BY op.created_at DESC
  `;
  db.query(q, (err, rows) => err ? reject(err) : resolve(rows));
});

const getOpportunityById = (id) => new Promise((resolve, reject) => {
  const q = `
    SELECT op.*, o.organization_name
    FROM opportunity op
    JOIN Organization o ON op.organization_id = o.organization_id
    WHERE op.opportunity_id = ?
  `;
  db.query(q, [id], (err, rows) => err ? reject(err) : resolve(rows[0]));
});

const createOpportunity = (data) => new Promise((resolve, reject) => {
  const q = `
    INSERT INTO opportunity
    (organization_id, role_title, job_type, drive_type, description, location, mode,
     stipend_or_ctc, duration_months, start_date, end_date, application_deadline, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;
  db.query(q, [
    data.organization_id, data.role_title,
    data.job_type || 'Placement', data.drive_type || 'On-Campus',
    data.description || null, data.location || null, data.mode || 'On-site',
    data.stipend_or_ctc || null, data.duration_months || null,
    data.start_date || null, data.end_date || null,
    data.application_deadline || null, data.status || 'Open'
  ], (err, result) => err ? reject(err) : resolve(result));
});

const updateOpportunity = (id, data) => new Promise((resolve, reject) => {
  const q = `
    UPDATE opportunity SET
    organization_id=?, role_title=?, job_type=?, drive_type=?, description=?,
    location=?, mode=?, stipend_or_ctc=?, duration_months=?, start_date=?,
    end_date=?, application_deadline=?, status=?
    WHERE opportunity_id=?
  `;
  db.query(q, [
    data.organization_id, data.role_title, data.job_type, data.drive_type || 'On-Campus',
    data.description || null, data.location || null, data.mode,
    data.stipend_or_ctc || null, data.duration_months || null,
    data.start_date || null, data.end_date || null,
    data.application_deadline || null, data.status, id
  ], (err, result) => err ? reject(err) : resolve(result));
});

const deleteOpportunity = (id) => new Promise((resolve, reject) => {
  db.query("DELETE FROM opportunity WHERE opportunity_id=?", [id],
    (err, result) => err ? reject(err) : resolve(result));
});

module.exports = { getAllOpportunities, getOpportunityById, createOpportunity, updateOpportunity, deleteOpportunity };
