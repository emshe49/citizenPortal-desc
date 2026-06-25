const Complaint = require("../models/Complaint");

const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.create(req.body);

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComplaints,
    createComplaint,
};


// ADD THIS NEW FUNCTION
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // This returns the updated document
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComplaints,
    createComplaint,
    updateComplaintStatus, // Export the new function
};