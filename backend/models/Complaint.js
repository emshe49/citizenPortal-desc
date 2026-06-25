// backend/models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
{
    citizenName: {
        type: String,
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"], // Add validation
        default: "Pending",
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Complaint", complaintSchema);