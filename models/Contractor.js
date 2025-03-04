const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const contractorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: Number, required: true },
    skills: { type: [String], required: true }, // ✅ Array of skills like ["Plumbing", "Masonry"]
    workType: { type: String }, // ✅ Residential, Commercial, Industrial
    availability: { type: String, enum: ["Available", "Busy"], default: "Available" }, // ✅ Contractor availability
    portfolio: { type: [String], default: [] }, // ✅ Array of image URLs (work samples)
    ratings: { type: Number, default: 0 }, // ✅ Average rating
    role: { type: String, enum: ["contractor"], default: "contractor" }
  },
  { timestamps: true }
);


const Contractor = mongoose.model("Contractor", contractorSchema);

module.exports = Contractor;
