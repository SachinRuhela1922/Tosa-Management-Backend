require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const variantRoutes = require("./routes/variantRoutes");
const componentRoutes =
    require("./routes/componentRoutes");
const contributeRoutes = require("./routes/contributeRoutes");
const { settleDue } = require("./services/contributeService");

const app = express();

const PORT = process.env.PORT || 5000;


// ============================================
// DATABASE
// ============================================

connectDatabase();


// ============================================
// MIDDLEWARE
// ============================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



// ============================================
// API ROUTES
// ============================================

app.use(
    "/api/categories",
    categoryRoutes
);


app.use(
    "/api/components",
    componentRoutes
);

app.use("/api/variants", variantRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/contribute", contributeRoutes);
// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Tosa backend is running."
    });

});


// ============================================
// 404
// ============================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});


// ============================================
// 24h CONTRIBUTION SETTLER
// (har 5 min me due contributions accept + coins credit)
// ============================================

setInterval(() => {
    settleDue().catch((err) =>
        console.error("Contribution settle failed:", err.message)
    );
}, 5 * 60 * 1000);


// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {

    console.log(
        `Tosa backend running on http://localhost:${PORT}`
    );

});