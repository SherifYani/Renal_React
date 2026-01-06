import React, { useState, useEffect } from "react";
import { Calendar, Clock, Search, Filter, Plus, Check, X } from "lucide-react";
import {
  getReservations,
  deleteReservation,
} from "../services/reservation.service";
import ScheduleReservationModal from "../components/modals/ScheduleReservationModal";
import SuccessNotification from "../components/common/SuccessNotification";
import { getEquipment } from "../services/equipment.service";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipment, setEquipment] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both reservations and equipment in parallel
      const [reservationsData, equipmentData] = await Promise.all([
        getReservations(),
        getEquipment(),
      ]);

      setReservations(reservationsData);
      setEquipment(equipmentData);
      setFilteredReservations(reservationsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((res) => {
        const resDate = new Date(res.startTime).toISOString().split("T")[0];
        return resDate === dateFilter;
      });
    }

    setFilteredReservations(filtered);
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await deleteReservation(id);
        setSuccessMessage("Reservation cancelled successfully");
        loadAllData();
      } catch (err) {
        console.error("Error deleting reservation:", err);
        setError("Failed to cancel reservation");
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:3001/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setSuccessMessage(`Reservation ${status} successfully`);
      loadAllData();
    } catch (err) {
      console.error("Error updating reservation:", err);
      setError("Failed to update reservation");
    }
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    loadAllData();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEquipmentName = (equipmentId) => {
    const foundEquipment = equipment.find((e) => e.id == equipmentId);
    return foundEquipment ? foundEquipment.name : `Equipment #${equipmentId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-700 dark:text-blue-200">
            Loading reservations and equipment data...
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
            Reservations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage equipment reservations and schedules
          </p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200">
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {reservations.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Reservations
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {reservations.filter((r) => r.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Confirmed
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {reservations.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pending
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {reservations.filter((r) => r.status === "cancelled").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cancelled
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
                placeholder="Search reservations..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Reservation Schedule ({filteredReservations.length})
          </h2>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={loadAllData}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm rounded-lg">
              Retry
            </button>
          </div>
        )}

        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No reservations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "No reservations scheduled"}
            </p>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200">
              Schedule First Reservation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {getEquipmentName(reservation.equipmentId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(reservation.startTime)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(reservation.startTime)} -{" "}
                        {formatTime(reservation.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {reservation.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : reservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {reservation.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(reservation.id, "confirmed")
                            }
                            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Confirm">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteReservation(reservation.id)
                          }
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Today's Reservations
        </h2>
        <div className="space-y-4">
          {reservations
            .filter((r) => {
              const today = new Date().toISOString().split("T")[0];
              const resDate = new Date(r.startTime).toISOString().split("T")[0];
              return resDate === today && r.status !== "cancelled";
            })
            .map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {getEquipmentName(reservation.equipmentId)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(reservation.startTime)} -{" "}
                    {formatTime(reservation.endTime)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {reservation.purpose}
                </div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reservation.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                    {reservation.status}
                  </span>
                </div>
              </div>
            ))}

          {reservations.filter((r) => {
            const today = new Date().toISOString().split("T")[0];
            const resDate = new Date(r.startTime).toISOString().split("T")[0];
            return resDate === today && r.status !== "cancelled";
          }).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No reservations scheduled for today
            </div>
          )}
        </div>
      </div>

      {/* Schedule Reservation Modal */}
      <ScheduleReservationModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => handleSuccess("Reservation scheduled successfully!")}
      />
    </div>
  );
};

export default Reservations;
