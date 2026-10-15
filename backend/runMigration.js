
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from backend/.env");
  }

  const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
  try {
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "add_email_verification.sql"
    );

    const sql = fs.readFileSync(migrationPath, "utf8");

    await pool.query(sql);
    console.log("Email verification migration completed successfully.");
  } finally {
    await pool.end();
  }
}

runMigration().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
