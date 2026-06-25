// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Citizens",
      value: stats?.totalCitizens || 0,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Services",
      value: stats?.totalServices || 0,
      icon: "🏛️",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Complaints",
      value: stats?.totalComplaints || 0,
      icon: "📝",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Pending Complaints",
      value: stats?.pendingComplaints || 0,
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Resolved Complaints",
      value: stats?.resolvedComplaints || 0,
      icon: "✅",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

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
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome Back, Admin! 👋
          </h1>
          <p className="text-gray-400 mt-2">
            Here's what's happening with your portal today
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              className={`${stat.bgColor} rounded-xl p-6 shadow-lg border border-gray-200/20`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-700 font-medium text-sm">{stat.title}</p>
              <div className={`mt-2 h-1 w-full bg-gradient-to-r ${stat.color} rounded-full opacity-50`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { title: "Manage Citizens", path: "/admin/citizens", icon: "👥", color: "from-blue-500 to-blue-600" },
            { title: "Manage Services", path: "/admin/services", icon: "🏛️", color: "from-green-500 to-green-600" },
            { title: "Manage Complaints", path: "/admin/complaints", icon: "📝", color: "from-purple-500 to-purple-600" },
          ].map((action) => (
            <Link key={action.path} to={action.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{action.title}</h3>
                    <p className="text-gray-400 text-sm">Click to manage</p>
                  </div>
                  <svg className="ml-auto h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">📋</span>
              Recent Complaints
            </h2>
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
              Latest 5
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Citizen</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Issue</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentComplaints?.length > 0 ? (
                  stats.recentComplaints.map((complaint, index) => (
                    <motion.tr
                      key={complaint._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-gray-300 font-medium">
                        {complaint.citizenName}
                      </td>
                      <td className="p-4 text-gray-400 max-w-xs truncate">
                        {complaint.issue}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.status === "Resolved"
                              ? "bg-green-600/20 text-green-400"
                              : complaint.status === "In Progress"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;