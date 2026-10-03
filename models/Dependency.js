const mongoose = require("mongoose");

const dependencySchema = new mongoose.Schema(
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

        version: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            enum: ["runtime", "development", "peer"],
            default: "runtime"
        },

        installCommand: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Dependency",
    dependencySchema,
    "dependencies"
);