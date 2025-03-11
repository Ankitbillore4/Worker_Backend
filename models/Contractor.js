const mongoose = require("mongoose");

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
    meetingCharges: { type: Number, required: true }, // ✅ New field for contractor meeting charges
    reviews: [
      { 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ User who gave the review
        rating: { type: Number, required: true, min: 1, max: 5 }, // ✅ Rating (1-5)
        comment: { type: String } // ✅ Optional review comment
      }
    ],
    role: { type: String, enum: ["contractor"], default: "contractor" } 
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", contractorSchema); 

module.exports = Contractor;
