const Contribution = require("../models/Contribution");

// ---------------- CONFIG (change freely) ----------------
const REVIEW_HOURS = 24;          // accept hone me lagne wala time
const START_RANK = 9;             // starting rank
const MIN_RANK = 1;               // best possible rank
const ACCEPTED_PER_RANK = 2;      // kitne accepted contributions pe rank 1 step upar
const COINS = { Easy: 10, Medium: 20, Hard: 40 };
// --------------------------------------------------------

const coinsFor = (difficulty) => COINS[difficulty] || COINS.Easy;

const rankFor = (accepted) =>
    Math.max(MIN_RANK, START_RANK - Math.floor(accepted / ACCEPTED_PER_RANK));

/**
 * Jo contributions 24h cross kar chuke hain unhe accept karo + coins do.
 * Idempotent: updateOne filter me status:"pending" hai, isliye coins
 * kabhi double credit nahi honge (even if sweeper + API same time chale).
 */
async function settleDue(userId) {
    const filter = { status: "pending", acceptAt: { $lte: new Date() } };
    if (userId) filter.userId = userId;

    const due = await Contribution.find(filter).select("_id difficulty").lean();

    for (const c of due) {
        await Contribution.updateOne(
            { _id: c._id, status: "pending" },
            {
                $set: {
                    status: "accepted",
                    acceptedAt: new Date(),
                    coinsAwarded: coinsFor(c.difficulty)
                }
            }
        );
    }
    return due.length;
}

async function getStats(userId) {
    const rows = await Contribution.find({ userId })
        .select("status difficulty coinsAwarded")
        .lean();

    let accepted = 0, pending = 0, rejected = 0, coins = 0, pendingCoins = 0;

    for (const r of rows) {
        if (r.status === "accepted") { accepted++; coins += r.coinsAwarded || 0; }
        else if (r.status === "pending") { pending++; pendingCoins += coinsFor(r.difficulty); }
        else rejected++;
    }

    const rank = rankFor(accepted);
    const inStep = accepted % ACCEPTED_PER_RANK;

    return {
        coins,
        pendingCoins,
        rank,
        startRank: START_RANK,
        total: rows.length,
        accepted,
        pending,
        rejected,
        perRank: ACCEPTED_PER_RANK,
        nextRankIn: rank === MIN_RANK ? 0 : ACCEPTED_PER_RANK - inStep,
        rankProgress: rank === MIN_RANK ? 1 : inStep / ACCEPTED_PER_RANK
    };
}

module.exports = {
    REVIEW_HOURS, coinsFor, rankFor, settleDue, getStats
};