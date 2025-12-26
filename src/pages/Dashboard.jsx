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
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    activeReservations: 0,
    maintenanceDue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Continue with other data even if equipment fails
      }

      // Fetch reservations data
      let reservationsData = [];
      try {
        reservationsData = await getReservations();
        console.log("Reservations data loaded:", reservationsData);
      } catch (reservationsErr) {
        console.error("Failed to load reservations:", reservationsErr);
      }

      // Fetch upcoming reservations
      let upcomingData = [];
      try {
        upcomingData = await getUpcomingReservations();
        console.log("Upcoming reservations loaded:", upcomingData);
      } catch (upcomingErr) {
        console.error("Failed to load upcoming reservations:", upcomingErr);
      }

      // Make sure data is array
      const equipment = Array.isArray(equipmentData) ? equipmentData : [];
      const reservations = Array.isArray(reservationsData)
        ? reservationsData
        : [];
      const upcoming = Array.isArray(upcomingData) ? upcomingData : [];

      // Calculate stats
      const available = equipment.filter(
        (item) => item.status === "available"
      ).length;
      const maintenanceDue = equipment.filter((item) => {
        if (!item.nextMaintenance) return false;
        try {
          const dueDate = new Date(item.nextMaintenance);
          const today = new Date();
          return dueDate <= today;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Equipment
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalEquipment}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Available Now
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.availableEquipment}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Active Reservations
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeReservations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 mr-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Maintenance Due
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.maintenanceDue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Quick Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {stats.availableEquipment}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Available
            </div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.activeReservations}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Reservations
            </div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.maintenanceDue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Maintenance Due
            </div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="text-2xl font-bold text-gray-600">
              {stats.totalEquipment -
                stats.availableEquipment -
                stats.maintenanceDue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              In Use
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            Add New Equipment
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
            Schedule Reservation
          </button>
          <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition">
            Report Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
