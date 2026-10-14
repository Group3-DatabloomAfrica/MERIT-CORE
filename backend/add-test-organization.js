
require("dotenv").config();

const pool = require("./db");

async function addTestOrganization() {
  try {
    const result = await pool.query(
      `INSERT INTO organizations
        (name, organization_type, description, is_verified)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        "MERIT-CORE Test Employer",
        "employer",
        "Temporary organization for backend testing",
        false
      ]
    );

    console.table(result.rows);
  } catch (error) {
    console.error("Could not add test organization:", error.message);
  } finally {
    await pool.end();
  }
}

addTestOrganization();
