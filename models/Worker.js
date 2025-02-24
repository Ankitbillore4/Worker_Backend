const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true  ,unique: true },
  skill: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true } // Make sure this line exists
});

module.exports = mongoose.model("Worker", WorkerSchema);
