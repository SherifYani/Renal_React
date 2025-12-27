import React, { useState, useEffect } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Calendar,
  ToolCase,
  RefreshCw,
} from "lucide-react";
import { getEquipment } from "../services/equipment.service";
import ReportMaintenanceModal from "../components/modals/ReportMaintenanceModal";
import SuccessNotification from "../components/common/SuccessNotification";

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load equipment
      const equipmentData = await getEquipment();
      setEquipment(equipmentData);

      // Load maintenance requests from JSON Server
      try {
        const response = await fetch(
          "http://localhost:3001/maintenanceRequests"
        );
        if (response.ok) {
          const maintenanceData = await response.json();
          setMaintenanceRequests(
            Array.isArray(maintenanceData) ? maintenanceData : []
          );
        } else {
          // If endpoint doesn't exist yet, use empty array
          setMaintenanceRequests([]);
        }
      } catch (fetchErr) {
        console.error("Error loading maintenance requests:", fetchErr);
        setMaintenanceRequests([]);
      }
    } catch (err) {
      console.error("Error loading maintenance data:", err);
      setError("Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      // First, update the maintenance request status
      await fetch(`http://localhost:3001/maintenanceRequests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      // If marking as completed, update the equipment status back to available
      if (status === "completed") {
        const maintenanceRequest = maintenanceRequests.find((r) => r.id === id);
        if (maintenanceRequest) {
          await fetch(
            `http://localhost:3001/equipment/${maintenanceRequest.equipmentId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "available",
                nextMaintenance: new Date(
                  new Date().setMonth(new Date().getMonth() + 3)
                )
                  .toISOString()
                  .split("T")[0],
              }),
            }
          );
        }
      }

      setSuccessMessage(`Maintenance request marked as ${status}`);
      loadData(); // Refresh all data
    } catch (err) {
      console.error("Error updating maintenance status:", err);
      setError("Failed to update maintenance status");
    }
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    loadData(); // Refresh all data after successful action
  };

  // Filter maintenance requests
  const filteredRequests = maintenanceRequests.filter((request) => {
    // Search filter
    if (
      searchTerm &&
      !request.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "all" && request.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // Get equipment by ID
  const getEquipmentById = (id) => {
    return (
      equipment.find((e) => e.id === id) || {
        name: `Equipment #${id}`,
        type: "Unknown",
        department: "Unknown",
      }
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <div className="text-lg text-gray-700 dark:text-blue-200">
            Loading maintenance data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Maintenance Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage equipment maintenance requests
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200">
            <Plus className="w-4 h-4" />
            Report Maintenance
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {maintenanceRequests.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Requests
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {maintenanceRequests.filter((r) => r.status === "reported").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Reported
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {
              maintenanceRequests.filter((r) => r.status === "in_progress")
                .length
            }
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            In Progress
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {maintenanceRequests.filter((r) => r.status === "completed").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Completed
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search maintenance requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Status</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Reported */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Active Maintenance Requests
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {
                    filteredRequests.filter((r) => r.status !== "completed")
                      .length
                  }{" "}
                  active
                </span>
              </div>
            </div>

            {error && (
              <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm rounded-lg">
                  Retry
                </button>
              </div>
            )}

            {filteredRequests.filter((r) => r.status !== "completed").length ===
            0 ? (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No active maintenance requests
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  All equipment is operational
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {filteredRequests
                  .filter((r) => r.status !== "completed")
                  .map((request) => {
                    const equipmentData = getEquipmentById(request.equipmentId);
                    return (
                      <div
                        key={request.id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {equipmentData.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {equipmentData.type} • {equipmentData.department}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                request.priority === "urgent"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : request.priority === "high"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                  : request.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}>
                              {request.priority}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === "reported"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {request.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(request.dateReported)}
                            </div>
                            <div className="flex items-center gap-1">
                              <ToolCase className="w-4 h-4" />
                              {request.issueType}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {request.status === "reported" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(request.id, "in_progress")
                                }
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200">
                                Start Work
                              </button>
                            )}
                            {request.status === "in_progress" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(request.id, "completed")
                                }
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200">
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Upcoming Maintenance */}
        <div>
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Maintenance
            </h3>
            <div className="space-y-4">
              {equipment
                .filter((e) => e.nextMaintenance && e.status !== "maintenance")
                .sort(
                  (a, b) =>
                    new Date(a.nextMaintenance) - new Date(b.nextMaintenance)
                )
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Next: {formatDate(item.nextMaintenance)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {item.type} • {item.department}
                    </div>
                  </div>
                ))}

              {equipment.filter(
                (e) => e.nextMaintenance && e.status !== "maintenance"
              ).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No upcoming maintenance scheduled
                </p>
              )}
            </div>
          </div>

          {/* Equipment Status */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Equipment Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Operational
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {
                    equipment.filter(
                      (e) => e.status === "available" || e.status === "in_use"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Under Maintenance
                </span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {equipment.filter((e) => e.status === "maintenance").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Needs Attention
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {
                    maintenanceRequests.filter(
                      (r) =>
                        r.status !== "completed" &&
                        (r.priority === "urgent" || r.priority === "high")
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Maintenance Modal */}
      <ReportMaintenanceModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={() => handleSuccess("Maintenance reported successfully!")}
      />
    </div>
  );
};

export default Maintenance;
