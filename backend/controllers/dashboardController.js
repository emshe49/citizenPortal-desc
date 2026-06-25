const Citizen = require("../models/Citizen");
const Service = require("../models/Service");
const Complaint = require("../models/Complaint");

const getDashboardStats = async (req, res) => {
  try {
    const totalCitizens = await Citizen.countDocuments();

    const totalServices = await Service.countDocuments();

    const totalComplaints = await Complaint.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({
      status: "Pending",
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: "Resolved",
    });

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCitizens,
      totalServices,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};