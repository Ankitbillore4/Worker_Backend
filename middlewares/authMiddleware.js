const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contractor = require("../models/Contractor");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = async (req, res, next) => {

    let token =  req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Check in both User and Contractor models
        let account = await User.findById(decoded.id).select("-password");
        if (!account) {
            account = await Contractor.findById(decoded.id).select("-password");
        }

        if (!account) {
            return res.status(401).json({ message: "Invalid token, user not found" });
        }

        req.user = account;
        console.log("Authenticated User:", req.user);
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
