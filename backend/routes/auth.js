

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../db");
const { sendVerificationEmail } = require("../emailService");




const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from your .env file");
}

// Register a student
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

if (
  typeof full_name !== "string" ||
  typeof email !== "string" ||
  typeof password !== "string" ||
  !full_name.trim() ||
  !email.trim() ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
  password.length < 8
    )
     {
      return res.status(400).json({
        message:
          "Full name, valid email, and password of at least 8 characters are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    
    const verificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );



    
const result = await pool.query(
  `INSERT INTO users
    (
      full_name,
      email,
      password_hash,
      role,
      is_verified,
      verification_token_hash,
      verification_token_expires_at
    )
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING id, full_name, email, role, is_verified, created_at`,
  [
    full_name.trim(),
    normalizedEmail,
    passwordHash,
    "student",
    false,
    verificationTokenHash,
    verificationTokenExpiresAt
  ]
);


   
const verificationUrl =
  `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

await sendVerificationEmail(normalizedEmail, verificationUrl);

return res.status(201).json({
  message: "Registration successful. Please check your email to verify your account.",
  user: result.rows[0]
});

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    console.error("Registration failed:", error.message);

    return res.status(500).json({
      message: "Registration failed due to a server error."
    });
  }
});


 // Verify email address
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).send("Invalid verification link.");
    }

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const result = await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           verification_token_hash = NULL,
           verification_token_expires_at = NULL,
           updated_at = NOW()
       WHERE verification_token_hash = $1
         AND verification_token_expires_at > NOW()
         AND is_verified = FALSE
       RETURNING id`,
      [verificationTokenHash]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .send("This verification link is invalid, expired, or already used.");
    }

    return res
      .status(200)
      .send("Email verified successfully! You can now log in to MERIT-CORE.");
  } catch (error) {
    console.error("Email verification failed:", error.message);

    return res
      .status(500)
      .send("Email verification failed due to a server error.");
  }
});


// Log in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, is_verified
       FROM users
       WHERE LOWER(email) = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }
    
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in."
      });
    }


    const token = jwt.sign(
      {
        sub: String(user.id),
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      message: "Login failed due to a server error."
    });
  }
});

module.exports = router;
