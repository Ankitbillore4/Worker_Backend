const Contractor = require('../models/Contractor');

// ✅ Get all contractors
exports.getContractors = async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.status(200).json(contractors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Get a single contractor by ID
exports.getContractorById = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Create a new contractor (Protected)
exports.createContractor = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can add contractors." });
        }

        const { name, email, phone, location, experience } = req.body;
        const contractor = new Contractor({ name, email, phone, location, experience });
        await contractor.save();
        res.status(201).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Update an existing contractor (Protected)
exports.updateContractor = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can update contractor details." });
        }

        const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Delete a contractor (Protected)
exports.deleteContractor = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can delete contractors." });
        }

        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        res.status(200).json({ message: 'Contractor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
