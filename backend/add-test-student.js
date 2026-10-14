
require("dotenv").config();

const pool = require("./db");

async function addTestStudent() {
  try {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, role, is_verified`,
      [
        "MERIT-CORE Test Student",
        "test.student@example.com",
        "TEST_ONLY_NOT_A_REAL_PASSWORD_HASH",
        "student",
        false
      ]
    );

    console.table(result.rows);
  } catch (error) {
    console.error("Could not create test student:", error.message);
  } finally {
    await pool.end();
  }
}

addTestStudent();
