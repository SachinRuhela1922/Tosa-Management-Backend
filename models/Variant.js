const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
    {
        componentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Component",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        shortDescription: {
            type: String,
            default: "",
            trim: true
        },

        installationCommand: {
            type: String,
            default: ""
        },

        usageCode: {
            type: String,
            default: ""
        },

        previewCode: {
            type: String,
            default: ""
        },

        folderStructure: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        version: {
            type: String,
            default: "1.0.0"
        },

        status: {
            type: String,
            enum: ["active", "draft", "deprecated"],
            default: "active"
        },

        order: {
            type: Number,
            default: 0
        },

        author: {
            type: String,
            default: "Tosa"
        }
    },
    {
        timestamps: true
    }
);

variantSchema.index(
    {
        componentId: 1,
        slug: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Variant",
    variantSchema,
    "variants"
);