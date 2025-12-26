// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { getEquipment } from "../services/equipment.service";
import {
  getReservations,
  getUpcomingReservations,
} from "../services/reservation.service";
import {
  Activity,
  Calendar,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Plus,
  Clock,
  Wrench,
} from "lucide-react";

// Import the new modal components
import AddEquipmentModal from "../components/modals/AddEquipmentModal";
import ScheduleReservationModal from "../components/modals/ScheduleReservationModal";
import ReportMaintenanceModal from "../components/modals/ReportMaintenanceModal";
import SuccessNotification from "../components/common/SuccessNotification";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    activeReservations: 0,
    maintenanceDue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showScheduleReservationModal, setShowScheduleReservationModal] =
    useState(false);
  const [showReportMaintenanceModal, setShowReportMaintenanceModal] =
    useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading dashboard data...");

      let equipmentData = [];
      try {
        equipmentData = await getEquipment();
        console.log("Equipment data loaded:", equipmentData);
      } catch (equipmentErr) {
        console.error("Failed to load equipment:", equipmentErr);
      }

      let reservationsData = [];
      try {
        reservationsData = await getReservations();
        console.log("Reservations data loaded:", reservationsData);
      } catch (reservationsErr) {
        console.error("Failed to load reservations:", reservationsErr);
      }

      let upcomingData = [];
      try {
        upcomingData = await getUpcomingReservations();
        console.log("Upcoming reservations loaded:", upcomingData);
      } catch (upcomingErr) {
        console.error("Failed to load upcoming reservations:", upcomingErr);
      }

      const equipment = Array.isArray(equipmentData) ? equipmentData : [];
      const reservations = Array.isArray(reservationsData)
        ? reservationsData
        : [];

      // Calculate stats
      const available = equipment.filter(
        (item) => item.status === "available"
      ).length;

      const maintenanceDue = equipment.filter((item) => {
        if (!item.nextMaintenance) return false;
        try {
          const dueDate = new Date(item.nextMaintenance);
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return dueDate <= nextWeek && dueDate >= today;
        } catch (e) {
          return false;
        }
      }).length;

      setStats({
        totalEquipment: equipment.length,
        availableEquipment: available,
        activeReservations: reservations.length,
        maintenanceDue: maintenanceDue,
      });
    } catch (err) {
      console.error("Unexpected error in loadDashboardData:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for button actions
  const handleAddEquipment = () => {
    setShowAddEquipmentModal(true);
  };

  const handleScheduleReservation = () => {
    setShowScheduleReservationModal(true);
  };

  const handleReportMaintenance = () => {
    setShowReportMaintenanceModal(true);
  };

  // Success handlers
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    loadDashboardData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <div className="text-lg text-gray-700 dark:text-blue-200">
            Loading dashboard data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6 mb-4 shadow-lg">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-colors duration-200">
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's what's happening with your medical equipment.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Equipment Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40 mr-4">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Equipment
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalEquipment}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Across all departments
            </p>
          </div>
        </div>

        {/* Available Now Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/40 mr-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Available Now
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.availableEquipment}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Ready for immediate use
            </p>
          </div>
        </div>

        {/* Active Reservations Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/40 mr-4">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Active Reservations
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.activeReservations}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently scheduled
            </p>
          </div>
        </div>

        {/* Maintenance Due Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 mr-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Maintenance Due
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.maintenanceDue}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              Within next 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Quick Status Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.availableEquipment}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
              Available
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Ready for use
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.activeReservations}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
              Active Reservations
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Currently booked
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.maintenanceDue}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
              Maintenance Due
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Needs attention
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {stats.totalEquipment -
                stats.availableEquipment -
                stats.maintenanceDue}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
              In Use
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Currently occupied
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAddEquipment}
            className="flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Equipment</span>
          </button>
          <button
            onClick={handleScheduleReservation}
            className="flex items-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Schedule Reservation</span>
          </button>
          <button
            onClick={handleReportMaintenance}
            className="flex items-center gap-3 px-6 py-4 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]">
            <Wrench className="w-5 h-5" />
            <span className="font-medium">Report Maintenance</span>
          </button>
        </div>
      </div>

      {/* Modal Components */}
      <AddEquipmentModal
        isOpen={showAddEquipmentModal}
        onClose={() => setShowAddEquipmentModal(false)}
        onSuccess={() => handleSuccess("Equipment added successfully!")}
      />

      <ScheduleReservationModal
        isOpen={showScheduleReservationModal}
        onClose={() => setShowScheduleReservationModal(false)}
        onSuccess={() => handleSuccess("Reservation scheduled successfully!")}
      />

      <ReportMaintenanceModal
        isOpen={showReportMaintenanceModal}
        onClose={() => setShowReportMaintenanceModal(false)}
        onSuccess={() => handleSuccess("Maintenance reported successfully!")}
      />
    </div>
  );
};

export default Dashboard;
