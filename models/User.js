const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true }, // ✅ Phone number field
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "contractor"], default: "user" }, // ✅ Removed "worker" role
    isAdmin: { type: Boolean, default: false }, // ✅ Admin field for better access control
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
