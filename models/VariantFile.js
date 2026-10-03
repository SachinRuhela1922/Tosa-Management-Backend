const mongoose = require("mongoose");

const variantFileSchema = new mongoose.Schema(
    {
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant",
            required: true,
            index: true
        },

        filename: {
            type: String,
            required: true,
            trim: true
        },

        path: {
            type: String,
            default: ""
        },

        language: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
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
    "VariantFile",
    variantFileSchema,
    "variant_files"
);