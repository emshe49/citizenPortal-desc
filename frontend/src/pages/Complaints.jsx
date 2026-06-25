// src/pages/Complaints.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import API from "../services/api";

function Complaints() {
  const [citizenName, setCitizenName] = useState("");
  const [issue, setIssue] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      showNotification("error", "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!citizenName.trim() || !issue.trim()) {
      showNotification("error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/complaints", {
        citizenName: citizenName.trim(),
        issue: issue.trim(),
      });

      setCitizenName("");
      setIssue("");
      await fetchComplaints();
      showNotification("success", "Complaint submitted successfully!");
    } catch (error) {
      showNotification("error", "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 4000);
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      resolved: "bg-green-100 text-green-800 border-green-200",
      "in progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-red-100 text-red-800 border-red-200",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      resolved: "✅",
      "in progress": "⏳",
      pending: "⏰",
    };
    return iconMap[status?.toLowerCase()] || "📋";
  };

  const getStatusGradient = (status) => {
    const gradientMap = {
      resolved: "from-green-500 to-green-600",
      "in progress": "from-yellow-500 to-yellow-600",
      pending: "from-red-500 to-red-600",
    };
    return gradientMap[status?.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === "all") return true;
    return complaint.status?.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status?.toLowerCase() === "pending").length,
    inProgress: complaints.filter((c) => c.status?.toLowerCase() === "in progress").length,
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20 pb-12">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm ${
              notification.type === "success"
                ? "bg-green-100/90 border-l-4 border-green-500"
                : "bg-red-100/90 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`text-lg ${
                  notification.type === "success" ? "text-green-500" : "text-red-500"
                } mr-2`}
              >
                {notification.type === "success" ? "✓" : "✕"}
              </motion.span>
              <p
                className={
                  notification.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block text-5xl mb-4"
          >
            📝
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Complaint Management
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600"
          >
            Submit and track your complaints in real-time
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Stats Sidebar */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <motion.h3
                variants={itemVariants}
                className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4"
              >
                📊 Statistics
              </motion.h3>
              <div className="space-y-3">
                {[
                  { label: "Total", value: stats.total, color: "blue", icon: "📊" },
                  { label: "Pending", value: stats.pending, color: "red", icon: "⏰" },
                  { label: "In Progress", value: stats.inProgress, color: "yellow", icon: "⏳" },
                  { label: "Resolved", value: stats.resolved, color: "green", icon: "✅" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={statVariants}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className={`flex justify-between items-center p-3 bg-${stat.color}-50 rounded-xl transition-all duration-200`}
                  >
                    <span className={`text-${stat.color}-600 font-medium flex items-center`}>
                      <span className="mr-2">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <motion.span
                      key={stat.value}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className={`text-xl font-bold text-${stat.color}-600`}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              {/* Filter */}
              <motion.div
                variants={itemVariants}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                  🎯 Filter
                </h3>
                <div className="space-y-2">
                  {["all", "pending", "in progress", "resolved"].map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilter(status)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        filter === status
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "🌟 All Complaints" : 
                       status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats Animation */}
              <motion.div
                variants={itemVariants}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolved
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Submit Complaint Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
            >
              <motion.h3
                variants={formItemVariants}
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
              >
                <span className="mr-3">✍️</span>
                Submit a Complaint
              </motion.h3>
              <form onSubmit={submitComplaint} className="space-y-4">
                <motion.div variants={formItemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Description *
                  </label>
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                  />
                </motion.div>
                <motion.button
                  variants={formItemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Complaint"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Complaints List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📋</span>
                  Recent Complaints
                </h3>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-md"
                >
                  {filteredComplaints.length} {filter === "all" ? "Total" : filter}
                </motion.span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                      <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading complaints...</p>
                  </div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    📭
                  </motion.div>
                  <p className="text-gray-500 text-xl font-medium">No complaints found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {filter === "all"
                      ? "Submit a complaint to get started"
                      : `No ${filter} complaints`}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
                >
                  {filteredComplaints.map((complaint, index) => (
                    <motion.div
                      key={complaint._id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.01,
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)"
                      }}
                      onClick={() => handleComplaintClick(complaint)}
                      className="group border-2 border-gray-100 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`h-12 w-12 rounded-full bg-gradient-to-r ${getStatusGradient(complaint.status)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                          >
                            {complaint.citizenName.charAt(0).toUpperCase()}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {complaint.citizenName}
                            </h4>
                            <p className="text-xs text-gray-400 flex items-center">
                              <span className="mr-2">🕐</span>
                              {new Date(complaint.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                            complaint.status
                          )} flex-shrink-0`}
                        >
                          <motion.span
                            animate={{ 
                              scale: complaint.status?.toLowerCase() === "pending" ? [1, 1.2, 1] : 1 
                            }}
                            transition={{ duration: 1, repeat: complaint.status?.toLowerCase() === "pending" ? Infinity : 0 }}
                            className="mr-1.5"
                          >
                            {getStatusIcon(complaint.status)}
                          </motion.span>
                          {complaint.status || "Pending"}
                        </motion.span>
                      </div>
                      <p className="text-gray-600 text-sm ml-15 pl-0 sm:pl-15 line-clamp-2">
                        {complaint.issue}
                      </p>
                      <div className="mt-2 ml-15 pl-0 sm:pl-15 flex items-center text-xs text-gray-400">
                        <span className="font-mono">#{complaint._id.slice(-8)}</span>
                        <span className="mx-2">•</span>
                        <span>Click to view details</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`h-16 w-16 rounded-full bg-gradient-to-r ${getStatusGradient(selectedComplaint.status)} flex items-center justify-center`}
                  >
                    <span className="text-2xl text-white font-bold">
                      {selectedComplaint.citizenName.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedComplaint.citizenName}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)}
                      <span className="ml-1">{selectedComplaint.status || "Pending"}</span>
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gray-50 rounded-xl mb-4"
              >
                <p className="text-sm text-gray-500 mb-2">Issue Description</p>
                <p className="text-gray-700 leading-relaxed">{selectedComplaint.issue}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-6"
              >
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedComplaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-2xl">🆔</span>
                  <div>
                    <p className="text-sm text-gray-500">Complaint ID</p>
                    <p className="font-mono text-sm text-gray-900">{selectedComplaint._id}</p>
                  </div>
                </div>
                {selectedComplaint.status?.toLowerCase() === "resolved" && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="font-medium text-green-600">This complaint has been resolved</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Complaints;