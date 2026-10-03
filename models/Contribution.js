const mongoose = require("mongoose");

// Collection name is explicitly "contribute" (as requested).
const contributionSchema = new mongoose.Schema(
    {
        // ---------- who contributed (profile snapshot) ----------
        userId: { type: String, required: true, index: true },
        profile: {
            name: { type: String, default: "" },
            uniqueId: { type: String, default: "", index: true },
            email: { type: String, default: "" },
            preferredLanguage: { type: String, default: "" },
            languageLevel: { type: String, default: "" }
        },

        // ---------- what they contributed ----------
        language: { type: String, default: "" },
        type: { type: String, required: true },
        typeTitle: { type: String, default: "" },
        title: { type: String, required: true, trim: true },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        },
        question: { type: String, required: true },
        code: { type: String, default: "" },
        options: { type: [String], default: undefined },
        correct: { type: Number, default: undefined },
        answer: { type: String, default: "" },
        explanation: { type: String, default: "" },
        tags: { type: [String], default: [] },

        // ---------- review / reward ----------
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
            index: true
        },
        acceptAt: { type: Date, required: true, index: true }, // createdAt + 24h
        acceptedAt: { type: Date, default: null },
        coinsAwarded: { type: Number, default: 0 }
    },
    { timestamps: true, collection: "contribute" }
);

module.exports = mongoose.model("Contribution", contributionSchema);