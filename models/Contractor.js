const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const contractorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }, // ✅ Made phone unique
    password: { type: String, required: true },
    location: { type: String, required: true }, // Contractor location
    experience: { type: Number, required: true }, // Years of experience
    role: { type: String, enum: ["contractor"], default: "contractor" } // ✅ Ensured only "contractor" role is allowed
  },
  { timestamps: true }
);

// ✅ Hash password before saving to DB
contractorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Password verification method
contractorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Contractor = mongoose.model("Contractor", contractorSchema);
module.exports = Contractor;
