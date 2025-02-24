const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure you have a User model
const dotenv = require("dotenv");

dotenv.config();

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]; // Optional chaining for cleaner token extraction

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
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
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

module.exports = protect; // Exporting as a function, not an object
