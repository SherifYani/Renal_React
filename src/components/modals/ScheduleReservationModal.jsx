import React, { useState, useEffect } from "react";
import { X, Clock, RefreshCw } from "lucide-react";
import { createReservation } from "../../services/reservation.service";
import { getEquipment } from "../../services/equipment.service";

const ScheduleReservationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    equipmentId: "",
    startTime: "",
    endTime: "",
    purpose: "",
    status: "pending",
  });

  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableEquipment();

      // Set default times
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endTime = new Date(tomorrow);
      endTime.setHours(tomorrow.getHours() + 2);

      setFormData({
        equipmentId: "",
        startTime: tomorrow.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        purpose: "",
        status: "pending",
      });
    }
  }, [isOpen]);

  const loadAvailableEquipment = async () => {
    setLoadingEquipment(true);
    try {
      const equipmentData = await getEquipment();
      const available = equipmentData.filter((e) => e.status === "available");
      setAvailableEquipment(available);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment list");
    } finally {
      setLoadingEquipment(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError("End time must be after start time");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const reservationData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      await createReservation(reservationData);
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        equipmentId: "",
        startTime: "",
        endTime: "",
        purpose: "",
        status: "pending",
      });
    } catch (err) {
      console.error("Error scheduling reservation:", err);
      setError("Failed to schedule reservation. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700/50">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Schedule New Reservation
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Select Equipment *
                </label>
                {loadingEquipment ? (
                  <div className="flex items-center gap-2 p-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Loading equipment...
                    </span>
                  </div>
                ) : availableEquipment.length === 0 ? (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                      No available equipment found.
                    </p>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.equipmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, equipmentId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200">
                    <option value="">Choose equipment...</option>
                    {availableEquipment.map((equipment) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.name} ({equipment.type}) -{" "}
                        {equipment.department}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Purpose *
                </label>
                <textarea
                  required
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  rows="3"
                  placeholder="Enter purpose of reservation..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex-1 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                disabled={submitting}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingEquipment ||
                  availableEquipment.length === 0
                }
                className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg flex-1 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors duration-200">
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {submitting ? "Scheduling..." : "Schedule Reservation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleReservationModal;
