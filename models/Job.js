const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, 
    budget: { type: Number, required: true },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Job creator
    applications: [{ worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
