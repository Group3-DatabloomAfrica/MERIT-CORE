

const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// GET a student's profile by user ID
router.get("/:userId", authenticateToken, async (req, res) => {
  const userId = Number(req.params.userId);


  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: "A valid user ID is required."
    });
  }

  if (String(req.user.id) !== String(req.params.userId)) {
  return res.status(403).json({
    success: false,
    message: "You can only access your own profile."
  });
}


  try {
    const result = await pool.query(
      `SELECT *
       FROM student_profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    res.json({
      success: true,
      profile: result.rows[0]
    });
  } catch (error) {
    console.error("Get student profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not retrieve student profile."
    });
  }
});

// CREATE a student's profile
router.post("/", authenticateToken, async (req, res) => {
  const {
    user_id,
    biography,
    institution_name,
    degree_name,
    field_of_study,
    graduation_year,
    skills_summary,
    career_interests,
    profile_photo_url
  } = req.body;

  const userId = Number(user_id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: "A valid user_id is required."
    });
  }

  const authenticatedUserId = Number(req.user.id);

  if (
    !Number.isSafeInteger(authenticatedUserId) ||
    authenticatedUserId <= 0 ||
    Number(user_id) !== authenticatedUserId
  ) {
    return res.status(403).json({
      success: false,
      message: "You can only create a profile for your own account."
    });
  }

  const year = graduation_year == null || graduation_year === ""
    ? null
    : Number(graduation_year);

  if (
    year !== null &&
    (!Number.isInteger(year) || year < 1950 || year > 2150)
  ) {
    return res.status(400).json({
      success: false,
      message: "Graduation year must be between 1950 and 2150."
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO student_profiles (
         user_id, biography, institution_name, degree_name,
         field_of_study, graduation_year, skills_summary,
         career_interests, profile_photo_url
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        biography ?? null,
        institution_name ?? null,
        degree_name ?? null,
        field_of_study ?? null,
        year,
        skills_summary ?? null,
        career_interests ?? null,
        profile_photo_url ?? null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      profile: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "The specified user does not exist."
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This user already has a student profile."
      });
    }

    console.error("Create student profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not create student profile."
    });
  }
});

 // UPDATE a student's profile by user ID
router.put("/:userId", authenticateToken, async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: "A valid user ID is required."
    });
  }

  if (String(req.user.id) !== String(userId)) {
  return res.status(403).json({
    success: false,
    message: "You can only update your own profile."
  });
}

  const {
    biography,
    institution_name,
    degree_name,
    field_of_study,
    graduation_year,
    skills_summary,
    career_interests,
    profile_photo_url
  } = req.body;

  const year =
    graduation_year == null || graduation_year === ""
      ? null
      : Number(graduation_year);

  if (
    year !== null &&
    (!Number.isInteger(year) || year < 1950 || year > 2150)
  ) {
    return res.status(400).json({
      success: false,
      message: "Graduation year must be between 1950 and 2150."
    });
  }

  try {
    const result = await pool.query(
      `UPDATE student_profiles
       SET biography = $1,
           institution_name = $2,
           degree_name = $3,
           field_of_study = $4,
           graduation_year = $5,
           skills_summary = $6,
           career_interests = $7,
           profile_photo_url = $8,
           updated_at = NOW()
       WHERE user_id = $9
       RETURNING *`,
      [
        biography ?? null,
        institution_name ?? null,
        degree_name ?? null,
        field_of_study ?? null,
        year,
        skills_summary ?? null,
        career_interests ?? null,
        profile_photo_url ?? null,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    res.json({
      success: true,
      message: "Student profile updated successfully.",
      profile: result.rows[0]
    });
  } catch (error) {
    console.error("Update student profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not update student profile."
    });
  }
});


module.exports = router;
