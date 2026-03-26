const db = require("../config/db");

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.error("❌ SQL ERROR:", err.message);
        console.error("   SQL:", sql.replace(/\s+/g, " ").trim().slice(0, 300));
        console.error("   Params:", params);
        reject(err);
      } else {
        resolve(rows);
      }
    })
  );

const safeQuery = async (label, sql, params = [], fallback = []) => {
  try {
    const rows = await query(sql, params);
    console.log(`✅ ${label}: ${rows.length} row(s)`);
    return rows;
  } catch (err) {
    console.error(`⚠️  ${label} failed: ${err.message}`);
    return fallback;
  }
};

const getDashboardReport = async (filters = {}) => {
  console.log("📊 getDashboardReport filters:", filters);

  let where = "WHERE 1=1";
  const values = [];

  if (filters.year && filters.year !== "") {
    where += " AND s.year_of_study = ?";
    values.push(Number(filters.year));
  }
  if (filters.cgpa_min && filters.cgpa_min !== "") {
    where += " AND s.cgpa >= ?";
    values.push(parseFloat(filters.cgpa_min));
  }
  if (filters.cgpa_max && filters.cgpa_max !== "") {
    where += " AND s.cgpa <= ?";
    values.push(parseFloat(filters.cgpa_max));
  }
  if (filters.organization_id && filters.organization_id !== "") {
    where += " AND o.organization_id = ?";
    values.push(Number(filters.organization_id));
  }
  if (filters.type && filters.type !== "") {
    where += " AND op.job_type = ?";
    values.push(filters.type);
  }

  console.log("WHERE:", where, "| values:", values);

  // Summary — LEFT JOINs guarantee one row always
  const summarySQL = `
    SELECT
      COUNT(DISTINCT s.student_id) AS totalStudents,
      COUNT(CASE WHEN a.status = 'Selected'  AND op.job_type = 'Placement'  THEN 1 END) AS totalPlaced,
      COUNT(CASE WHEN a.status = 'Selected'  AND op.job_type = 'Internship' THEN 1 END) AS totalInternshipsConfirmed,
      COUNT(CASE WHEN a.status = 'In Process'                                THEN 1 END) AS totalInProcess,
      COUNT(CASE WHEN a.status = 'Rejected'                                  THEN 1 END) AS totalRejected,
      ROUND(
        COUNT(CASE WHEN a.status = 'Selected' AND op.job_type = 'Placement' THEN 1 END)
        / NULLIF(COUNT(DISTINCT s.student_id), 0) * 100
      , 1) AS placementRate
    FROM student s
    LEFT JOIN application  a  ON s.student_id      = a.student_id
    LEFT JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    LEFT JOIN organization o  ON op.organization_id = o.organization_id
    ${where}
  `;

  // Application funnel by status
  const stageSQL = `
    SELECT a.status AS name, COUNT(*) AS value
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where}
    GROUP BY a.status
    ORDER BY value DESC
  `;

  // Top companies by placements
  const orgSQL = `
    SELECT o.organization_name AS name, COUNT(*) AS count
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where} AND a.status = 'Selected'
    GROUP BY o.organization_name
    ORDER BY count DESC
    LIMIT 10
  `;

  // Placements by year of study
  const yearSQL = `
    SELECT CONCAT('Year ', s.year_of_study) AS name, COUNT(*) AS placed
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where} AND a.status = 'Selected' AND op.job_type = 'Placement'
    GROUP BY s.year_of_study
    ORDER BY s.year_of_study
  `;

  // Placement vs Internship ratio
  const ratioSQL = `
    SELECT op.job_type AS name, COUNT(*) AS value
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where}
    GROUP BY op.job_type
  `;

  // Drive type breakdown
  const driveTypeSQL = `
    SELECT COALESCE(op.drive_type, 'Unknown') AS name, COUNT(*) AS value
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where}
    GROUP BY op.drive_type
  `;

  // Department-wise placements
  const deptSQL = `
    SELECT COALESCE(s.department, 'Unknown') AS name, COUNT(*) AS placed
    FROM application  a
    JOIN student      s  ON a.student_id      = s.student_id
    JOIN opportunity  op ON a.opportunity_id   = op.opportunity_id
    JOIN organization o  ON op.organization_id = o.organization_id
    ${where} AND a.status = 'Selected'
    GROUP BY s.department
    ORDER BY placed DESC
    LIMIT 8
  `;

  // Monthly trend — last 6 months, no custom filters
  const trendSQL = `
    SELECT
      DATE_FORMAT(a.application_date, '%b %Y') AS month,
      COUNT(*) AS applications,
      COUNT(CASE WHEN a.status = 'Selected' THEN 1 END) AS selected
    FROM application a
    WHERE a.application_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(a.application_date, '%Y-%m')
    ORDER BY MIN(a.application_date)
  `;

  const [summaryRows, stage, orgs, years, ratio, driveType, dept, trend] =
    await Promise.all([
      safeQuery("summary",   summarySQL,   values, []),
      safeQuery("stage",     stageSQL,     values, []),
      safeQuery("orgs",      orgSQL,       values, []),
      safeQuery("years",     yearSQL,      values, []),
      safeQuery("ratio",     ratioSQL,     values, []),
      safeQuery("driveType", driveTypeSQL, values, []),
      safeQuery("dept",      deptSQL,      values, []),
      safeQuery("trend",     trendSQL,     [],     []),
    ]);

  const summary = summaryRows[0] ?? {
    totalStudents: 0, totalPlaced: 0, totalInternshipsConfirmed: 0,
    totalInProcess: 0, totalRejected: 0, placementRate: 0,
  };

  console.log("📦 summary:", summary);

  return {
    summary,
    applicationsByStatus:     stage,
    topCompaniesByPlacements:  orgs,
    placementByYear:           years,
    internshipVsPlacement:     ratio,
    driveTypeBreakdown:        driveType,
    placementByDepartment:     dept,
    monthlyTrend:              trend,
  };
};

module.exports = { getDashboardReport };