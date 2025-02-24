const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found, invalid token" });
        }

        console.log("Authenticated User:", req.user);
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
