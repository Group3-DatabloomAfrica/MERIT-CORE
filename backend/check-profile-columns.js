require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await client.connect();

    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'student_profiles'
      ORDER BY ordinal_position
    `);

    console.table(result.rows);
  } catch (error) {
    console.error("Database check failed:", error.message);
  } finally {
    await client.end();
  }
}

main();