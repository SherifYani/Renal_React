import { useState, useEffect } from "react";
import { X, Clock, RefreshCw } from "lucide-react";
import {
  createReservation,
  getReservations,
} from "../../services/reservation.service";
import {
  getEquipment,
} from "../../services/equipment.service";

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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  useEffect(() => {
    if (isOpen) {
      loadAvailableEquipment();

      const now = new Date();
      // Round up to nearest 15 minutes
      const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
      const startTime = new Date(now);
      startTime.setMinutes(roundedMinutes);
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      setFormData({
        equipmentId: "",
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        purpose: "",
        status: "pending",
      });
      setAvailabilityMessage("");
    }
  }, [isOpen]);

  // Check availability when dates or equipment change
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.equipmentId || !formData.startTime || !formData.endTime) {
        setAvailabilityMessage("");
        return;
      }

      setAvailabilityLoading(true);
      try {
        const existingReservations = await getReservations();

        const conflicts = existingReservations.filter((reservation) => {
          if (reservation.equipmentId !== formData.equipmentId) return false;
          if (["cancelled", "completed"].includes(reservation.status))
            return false;

          const newStart = new Date(formData.startTime);
          const newEnd = new Date(formData.endTime);
          const existingStart = new Date(reservation.startTime);
          const existingEnd = new Date(reservation.endTime);

          return newStart < existingEnd && newEnd > existingStart;
        });

        if (conflicts.length > 0) {
          const conflict = conflicts[0];
          setAvailabilityMessage(
            `Equipment is booked from ${formatTime(
              conflict.startTime
            )} to ${formatTime(conflict.endTime)}`
          );
        } else {
          setAvailabilityMessage("Equipment is available for this time slot");
        }
      } catch (err) {
        console.error("Error checking availability:", err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    // Debounce the availability check
    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.equipmentId, formData.startTime, formData.endTime]);

  // Add formatTime helper function inside the component
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const loadAvailableEquipment = async () => {
    setLoadingEquipment(true);
    try {
      const equipmentData = await getEquipment();
      const available = equipmentData.filter((e) => e.status === "available");
      setAvailableEquipment(available);
      setLoadingEquipment(false);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment list");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError("End time must be after start time");
      return;
    }

    // Validate equipment is selected
    if (!formData.equipmentId) {
      setError("Please select equipment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // First, get all existing reservations to check for conflicts
      const existingReservations = await getReservations();

      // Check for time conflicts with selected equipment
      const timeConflicts = existingReservations.filter((reservation) => {
        // Skip if different equipment or cancelled/completed reservations
        if (reservation.equipmentId !== formData.equipmentId) return false;
        if (["cancelled", "completed"].includes(reservation.status))
          return false;

        const newStart = new Date(formData.startTime);
        const newEnd = new Date(formData.endTime);
        const existingStart = new Date(reservation.startTime);
        const existingEnd = new Date(reservation.endTime);

        // Check for overlap: new reservation overlaps with existing one
        // Conditions for overlap: newStart < existingEnd AND newEnd > existingStart
        return newStart < existingEnd && newEnd > existingStart;
      });

      if (timeConflicts.length > 0) {
        setError(`Selected equipment is not available during the requested time. 
        It has ${timeConflicts.length} conflicting reservation(s). 
        Please choose a different time or equipment.`);
        setSubmitting(false);
        return;
      }

      // Create reservation if no conflicts
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
      setError(
        err.response?.data?.message ||
          "Failed to schedule reservation. Please try again."
      );
    } finally {
      setSubmitting(false);
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
                    min={new Date().toISOString().slice(0, 16)}
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
                    min={
                      formData.startTime ||
                      new Date().toISOString().slice(0, 16)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              {availabilityLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking availability...
                </div>
              )}

              {availabilityMessage && (
                <div
                  className={`text-sm ${
                    availabilityMessage.includes("✅")
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}>
                  {availabilityMessage}
                </div>
              )}

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
