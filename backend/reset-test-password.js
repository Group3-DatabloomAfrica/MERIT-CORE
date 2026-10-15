
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { Client } = require("pg");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const password = await rl.question("Enter the new test-account password: ");
  rl.close();

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      `UPDATE users
       SET password_hash = $1
       WHERE email = $2
       RETURNING id, email`,
      [passwordHash, "auth.test@example.com"]
    );

    if (result.rowCount === 0) {
      console.log("No test account found. No account was updated.");
    } else {
      console.log("Test account password updated:", result.rows[0]);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exitCode = 1;
});
