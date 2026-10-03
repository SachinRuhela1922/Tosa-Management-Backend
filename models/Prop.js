const mongoose = require("mongoose");

const propSchema = new mongoose.Schema(
    {
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            trim: true
        },

        defaultValue: {
            type: String,
            default: ""
        },

        required: {
            type: Boolean,
            default: false
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
    "Prop",
    propSchema,
    "props"
);