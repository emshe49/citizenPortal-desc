// src/pages/AdminServices.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    icon: "📋",
    fee: "Free",
    processingTime: "2-3 Business Days",
    isActive: true,
  });
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const categories = [
    { value: "Identity", label: "Identity", icon: "🪪" },
    { value: "Property", label: "Property", icon: "🏠" },
    { value: "Business", label: "Business", icon: "💼" },
    { value: "Education", label: "Education", icon: "🎓" },
    { value: "Healthcare", label: "Healthcare", icon: "🏥" },
    { value: "Transport", label: "Transport", icon: "🚗" },
    { value: "Other", label: "Other", icon: "📋" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      console.log("Fetched services:", res.data); // Debug log
      setServices(res.data);
    } catch (error) {
      showNotification("error", "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate category
    if (!formData.category) {
      showNotification("error", "Please select a category");
      return;
    }

    // Validate title
    if (!formData.title.trim()) {
      showNotification("error", "Please enter a service title");
      return;
    }

    // Validate description
    if (!formData.description.trim()) {
      showNotification("error", "Please enter a service description");
      return;
    }

    const serviceData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category, // This will be "Identity", "Property", etc.
      icon: formData.icon || "📋",
      fee: formData.fee || "Free",
      processingTime: formData.processingTime || "2-3 Business Days",
      isActive: formData.isActive !== undefined ? formData.isActive : true,
    };

    console.log("Submitting service:", serviceData); // Debug log

    try {
      let response;
      if (editingService) {
        response = await API.put(`/services/${editingService._id}`, serviceData);
        showNotification("success", "Service updated successfully!");
      } else {
        response = await API.post("/services", serviceData);
        showNotification("success", "Service added successfully!");
      }
      console.log("Response:", response.data); // Debug log
      
      await fetchServices();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showNotification("error", error.response?.data?.message || `Failed to ${editingService ? "update" : "add"} service`);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category || "Other",
      icon: service.icon || "📋",
      fee: service.fee || "Free",
      processingTime: service.processingTime || "2-3 Business Days",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await API.delete(`/services/${id}`);
        await fetchServices();
        showNotification("success", "Service deleted successfully!");
      } catch (error) {
        showNotification("error", "Failed to delete service");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "", // Empty string so user must select
      icon: "📋",
      fee: "Free",
      processingTime: "2-3 Business Days",
      isActive: true,
    });
    setEditingService(null);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : "📋";
  };

  // Debug: Log services by category
  console.log("Services by category:", {
    Identity: services.filter(s => s.category === "Identity"),
    Property: services.filter(s => s.category === "Property"),
    Business: services.filter(s => s.category === "Business"),
    Education: services.filter(s => s.category === "Education"),
    Healthcare: services.filter(s => s.category === "Healthcare"),
    Transport: services.filter(s => s.category === "Transport"),
    Other: services.filter(s => s.category === "Other" || !s.category),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading services...</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Services</h1>
            <p className="text-gray-400 mt-1">View and manage all government services</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Service</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search services by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 pl-14 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
            <svg className="absolute left-5 top-4 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Services Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Title</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Category</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Fee</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No services found</td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <motion.tr
                      key={service._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{service.icon || "📋"}</span>
                          <span>{service.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                          {getCategoryIcon(service.category)} {service.category || "Other"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{service.fee || "Free"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive !== false
                            ? "bg-green-600/20 text-green-400"
                            : "bg-red-600/20 text-red-400"
                        }`}>
                          {service.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-sm transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-sm transition-all duration-200"
                          >
                            Delete
                          </button>
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

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="Enter service title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                    placeholder="Enter service description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji)</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="📋"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fee</label>
                    <input
                      type="text"
                      name="fee"
                      value={formData.fee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="Free"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Processing Time</label>
                  <input
                    type="text"
                    name="processingTime"
                    value={formData.processingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="2-3 Business Days"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="text-sm font-medium text-gray-300">Active</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
                  >
                    {editingService ? "Update Service" : "Add Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminServices;