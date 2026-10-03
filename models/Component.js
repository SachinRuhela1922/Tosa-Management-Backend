const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
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

        icon: {
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


// Same component name cannot exist twice
// inside the same category.

componentSchema.index(
    {
        categoryId: 1,
        slug: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Component",
    componentSchema,
    "components"
);