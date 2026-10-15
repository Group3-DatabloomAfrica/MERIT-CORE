
require("dotenv").config();

const pool = require("./db");

async function checkUsersTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log("Users table columns:");
    console.table(result.rows);
  } catch (error) {
    console.error("Could not inspect users table:", error.message);
  } finally {
    await pool.end();
  }
}

checkUsersTable();
