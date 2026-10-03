const jwt = require("jsonwebtoken");

// Common env names jinme log JWT secret rakhte hain
const SECRET =
    process.env.JWT_SECRET ||
    process.env.JWT_KEY ||
    process.env.JWT_SECRET_KEY ||
    process.env.TOKEN_SECRET ||
    process.env.SECRET_KEY ||
    process.env.SECRET;

module.exports = (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!token) {
            console.error("[contributeAuth] token missing in Authorization header");
            return res.status(401).json({ success: false, message: "Not authenticated." });
        }

        if (!SECRET) {
            console.error("[contributeAuth] JWT secret .env me nahi mila (JWT_SECRET etc.)");
            return res.status(401).json({ success: false, message: "Server auth not configured." });
        }

        const decoded = jwt.verify(token, SECRET);

        const id =
            decoded.id ||
            decoded._id ||
            decoded.userId ||
            decoded.uniqueId ||
            decoded.profileId ||
            decoded.sub ||
            (decoded.user && (decoded.user.id || decoded.user._id || decoded.user.uniqueId));

        if (!id) {
            console.error("[contributeAuth] token verify hua par id nahi mili. Token payload keys:", Object.keys(decoded));
            return res.status(401).json({ success: false, message: "Invalid token payload." });
        }

        req.userId = String(id);
        next();
    } catch (err) {
        // err.message = "invalid signature" => secret galat, "jwt expired" => token expire
        console.error("[contributeAuth] verify failed:", err.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};