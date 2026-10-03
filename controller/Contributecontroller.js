const Contribution = require("../models/Contribution");
const { REVIEW_HOURS, coinsFor, settleDue, getStats } = require("../services/contributeService");

const str = (v, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// POST /api/contribute
exports.createContribution = async (req, res) => {
    try {
        const b = req.body || {};
        const p = b.profile || {};

        const question = str(b.question, 10000);
        const title = str(b.title, 200);
        const type = str(b.type, 50);

        if (!type || !title || question.length < 20) {
            return res.status(400).json({
                success: false,
                message: "Title, type aur question (min 20 characters) zaruri hain."
            });
        }

        let options, correct;
        if (type === "mcq") {
            options = Array.isArray(b.options) ? b.options.map((o) => str(o, 500)) : [];
            if (options.length !== 4 || options.some((o) => !o)) {
                return res.status(400).json({ success: false, message: "MCQ ke 4 options zaruri hain." });
            }
            correct = Number.isInteger(b.correct) && b.correct >= 0 && b.correct < 4 ? b.correct : 0;
        }

        const difficulty = ["Easy", "Medium", "Hard"].includes(b.difficulty) ? b.difficulty : "Easy";
        const acceptAt = new Date(Date.now() + REVIEW_HOURS * 60 * 60 * 1000);

        const doc = await Contribution.create({
            userId: req.userId,
            profile: {
                name: str(p.name, 100),
                uniqueId: str(p.uniqueId, 60),
                email: str(p.email, 150),
                preferredLanguage: str(b.language, 50),
                languageLevel: str(b.languageLevel, 50)
            },
            language: str(b.language, 50),
            type,
            typeTitle: str(b.typeTitle, 100),
            title,
            difficulty,
            question,
            code: str(b.code, 20000),
            options,
            correct,
            answer: str(b.answer, 20000),
            explanation: str(b.explanation, 10000),
            tags: Array.isArray(b.tags) ? b.tags.map((t) => str(t, 40)).filter(Boolean).slice(0, 15) : [],
            acceptAt
        });

        return res.status(201).json({
            success: true,
            message: "Contribution submitted.",
            contribution: { _id: doc._id, acceptAt: doc.acceptAt, coinsPotential: coinsFor(difficulty) }
        });
    } catch (err) {
        console.error("createContribution:", err);
        return res.status(500).json({ success: false, message: "Server error while submitting." });
    }
};

// GET /api/contribute/me  -> stats + history
exports.getMyContributions = async (req, res) => {
    try {
        await settleDue(req.userId); // 24h complete ho chuke ho to abhi accept + coins

        const [stats, list] = await Promise.all([
            getStats(req.userId),
            Contribution.find({ userId: req.userId })
                .select("title type typeTitle language difficulty status createdAt acceptAt acceptedAt coinsAwarded")
                .sort({ createdAt: -1 })
                .limit(100)
                .lean()
        ]);

        const contributions = list.map((c) => ({ ...c, coinsPotential: coinsFor(c.difficulty) }));

        return res.json({ success: true, stats, contributions });
    } catch (err) {
        console.error("getMyContributions:", err);
        return res.status(500).json({ success: false, message: "Could not load rewards." });
    }
};