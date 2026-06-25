// backend/models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            "Identity",
            "Property",
            "Business",
            "Education",
            "Healthcare",
            "Transport",
            "Other"
        ],
        default: "Other",
        required: true,
    },
    icon: {
        type: String,
        default: "📋",
    },
    fee: {
        type: String,
        default: "Free",
    },
    processingTime: {
        type: String,
        default: "2-3 Business Days",
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Service", serviceSchema);