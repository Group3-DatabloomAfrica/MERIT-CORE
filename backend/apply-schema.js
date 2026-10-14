
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function applySchema() {
  try {
    const schemaPath = path.join(
      __dirname,
      "database",
      "schema.sql"
    );

    const sql = fs.readFileSync(schemaPath, "utf8");

    await pool.query(sql);

    console.log("Database schema applied successfully.");

    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.table(result.rows);
  } catch (error) {
    console.error("Schema application failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

applySchema();
