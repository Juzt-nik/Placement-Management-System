const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sag@2006nik",
  database: "placement_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
db.query("SELECT DATABASE()", (err, result) => {
  if (err) {
    console.error("❌ DB connection error:", err.message);
  } else {
    console.log("✅ Backend connected to DB:", result[0]["DATABASE()"]);
  }
});

module.exports = db;