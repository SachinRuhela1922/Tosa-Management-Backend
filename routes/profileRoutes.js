const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Profile = require("../models/Profile");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "change-this-secret";

const generateUniqueId = async () => {
  let uniqueId;
  let exists = true;

  while (exists) {
    const randomPart = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();

    uniqueId = `TOSA-${randomPart}`;

    exists = await Profile.exists({
      uniqueId,
    });
  }

  return uniqueId;
};

/*
===========================================
CREATE PROFILE
POST /api/profile/create
===========================================
*/

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      place,
      education,
      github,
      leetcode,
      preferredLanguage,
      languageLevel,
      password,
    } = req.body;

    if (
      !name ||
      !place ||
      !education ||
      !github ||
      !leetcode ||
      !preferredLanguage ||
      !languageLevel ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    /*
    24 hours from the moment profile is created.
    */
    const createdAt = new Date();

    const activationAt = new Date(
      createdAt.getTime() + 24 * 60 * 60 * 1000
    );

    const uniqueId = await generateUniqueId();

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const profile = await Profile.create({
      uniqueId,
      name,
      place,
      education,
      github,
      leetcode,
      preferredLanguage,
      languageLevel,
      password: hashedPassword,
      createdAt,
      activationAt,
      isActive: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Profile created successfully. Login will be available after 24 hours.",

      profile: {
        uniqueId: profile.uniqueId,
        name: profile.name,
        activationAt: profile.activationAt,
      },
    });
  } catch (error) {
    console.error("Profile creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create profile.",
    });
  }
});

/*
===========================================
LOGIN
POST /api/profile/login
===========================================
*/

router.post("/login", async (req, res) => {
  try {
    const { uniqueId, password } = req.body;

    if (!uniqueId || !password) {
      return res.status(400).json({
        success: false,
        message: "Unique ID and password are required.",
      });
    }

    const profile = await Profile.findOne({
      uniqueId: uniqueId.toUpperCase().trim(),
    }).select("+password");

    if (!profile) {
      return res.status(401).json({
        success: false,
        message: "Invalid unique ID or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      profile.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid unique ID or password.",
      });
    }

    const now = new Date();

    /*
    Account is locked until 24 hours
    after profile creation.
    */

    if (now < profile.activationAt) {
      const remaining =
        profile.activationAt.getTime() - now.getTime();

      const remainingHours = Math.ceil(
        remaining / (1000 * 60 * 60)
      );

      return res.status(403).json({
        success: false,
        message: `Your account is not active yet. Please wait approximately ${remainingHours} more hour(s).`,
        activationAt: profile.activationAt,
      });
    }

    /*
    Automatically activate after 24 hours.
    */

    if (!profile.isActive) {
      profile.isActive = true;
    }

    profile.lastLoginAt = now;

    await profile.save();

    const token = jwt.sign(
      {
        profileId: profile._id,
        uniqueId: profile.uniqueId,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      profile: {
        id: profile._id,
        uniqueId: profile.uniqueId,
        name: profile.name,
        place: profile.place,
        education: profile.education,
        github: profile.github,
        leetcode: profile.leetcode,
        preferredLanguage:
          profile.preferredLanguage,
        languageLevel: profile.languageLevel,
        isActive: profile.isActive,
      },
    });
  } catch (error) {
    console.error("Profile login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

module.exports = router;