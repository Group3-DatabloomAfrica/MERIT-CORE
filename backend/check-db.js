
require("dotenv").config();

const pool = require("./db");

async function checkDatabase() {
  try {
    const result = await pool.query(
      "SELECT table_schema, table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' ORDER BY table_schema, table_name",
      
    );

    console.log("Tables found in Render PostgreSQL:");
    console.table(result.rows);
  } catch (error) {
    console.error("Database check failed:", error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();

