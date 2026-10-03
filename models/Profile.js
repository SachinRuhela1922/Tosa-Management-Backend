const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    place: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    education: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    github: {
      type: String,
      required: true,
      trim: true,
    },

    leetcode: {
      type: String,
      required: true,
      trim: true,
    },

    preferredLanguage: {
      type: String,
      required: true,
      trim: true,
    },

    languageLevel: {
      type: String,
      required: true,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    activationAt: {
      type: Date,
      required: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);