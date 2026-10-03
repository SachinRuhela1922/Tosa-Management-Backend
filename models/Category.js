const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },

        type: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        icon: {
            type: String,
            default: "",
            trim: true
        },

        website: {
            type: String,
            default: "",
            trim: true
        },

        documentationUrl: {
            type: String,
            default: "",
            trim: true
        },

        version: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            enum: ["active", "draft", "inactive"],
            default: "active"
        },

        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Category",
    categorySchema,
    "categories"
);