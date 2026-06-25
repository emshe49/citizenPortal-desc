// src/pages/AdminComplaints.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      showNotification("error", "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      // Make sure we're using the correct endpoint
      const response = await API.put(`/complaints/${id}`, { status });
      
      // Update the local state to reflect the change
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint._id === id 
            ? { ...complaint, status: status }
            : complaint
        )
      );
      
      showNotification("success", `Complaint marked as ${status}`);
    } catch (error) {
      console.error("Error updating complaint:", error);
      showNotification("error", error.response?.data?.message || "Failed to update complaint status");
    } finally {
      setUpdating(null);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      resolved: "bg-green-600/20 text-green-400",
      "in progress": "bg-yellow-600/20 text-yellow-400",
      pending: "bg-red-600/20 text-red-400",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-600/20 text-gray-400";
  };

  const getStatusOptions = (currentStatus) => {
    const options = [];
    if (currentStatus !== "pending") {
      options.push({ value: "pending", label: "Pending", color: "red" });
    }
    if (currentStatus !== "in progress") {
      options.push({ value: "in progress", label: "In Progress", color: "yellow" });
    }
    if (currentStatus !== "resolved") {
      options.push({ value: "resolved", label: "Resolved", color: "green" });
    }
    return options;
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || complaint.status?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const statusStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status?.toLowerCase() === "pending").length,
    inProgress: complaints.filter(c => c.status?.toLowerCase() === "in progress").length,
    resolved: complaints.filter(c => c.status?.toLowerCase() === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Complaints</h1>
          <p className="text-gray-400 mt-1">View and manage all citizen complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{statusStats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-red-400">{statusStats.pending}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-400">{statusStats.inProgress}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-green-400">{statusStats.resolved}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by citizen name or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 pl-14 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
            <svg className="absolute left-5 top-4 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Citizen</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Issue</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No complaints found</td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <motion.tr
                      key={complaint._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">{complaint.citizenName}</td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">{complaint.issue}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Status Update Dropdown */}
                          <select
                            value={complaint.status || "pending"}
                            onChange={(e) => updateStatus(complaint._id, e.target.value)}
                            disabled={updating === complaint._id}
                            className="px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-50"
                          >
                            <option value="pending">⏰ Pending</option>
                            <option value="in progress">⏳ In Progress</option>
                            <option value="resolved">✅ Resolved</option>
                          </select>

                          {/* Quick Action Buttons */}
                          {complaint.status !== "in progress" && (
                            <button
                              onClick={() => updateStatus(complaint._id, "in progress")}
                              disabled={updating === complaint._id}
                              className="px-3 py-1.5 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                            >
                              {updating === complaint._id ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                "Start"
                              )}
                            </button>
                          )}
                          {complaint.status !== "resolved" && (
                            <button
                              onClick={() => updateStatus(complaint._id, "resolved")}
                              disabled={updating === complaint._id}
                              className="px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                            >
                              {updating === complaint._id ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                "Resolve"
                              )}
                            </button>
                          )}
                          {complaint.status !== "pending" && (
                            <button
                              onClick={() => updateStatus(complaint._id, "pending")}
                              disabled={updating === complaint._id}
                              className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                            >
                              {updating === complaint._id ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                "Pending"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;