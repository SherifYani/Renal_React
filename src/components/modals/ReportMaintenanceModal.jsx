import React, { useState, useEffect } from "react";
import { X, Wrench, RefreshCw } from "lucide-react";
import { getEquipment } from "../../services/equipment.service";
import { maintenanceService } from "../../services/maintenance.service";

const ReportMaintenanceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    equipmentId: "",
    issueType: "routine",
    description: "",
    priority: "medium",
    dateReported: "",
    dateCompleted: "",
  });

  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAllEquipment();
      setFormData({
        equipmentId: "",
        issueType: "routine",
        description: "",
        priority: "medium",
        dateReported: "",
        dateCompleted: "",
      });
    }
  }, [isOpen]);

  const loadAllEquipment = async () => {
    setLoadingEquipment(true);
    try {
      const equipmentData = await getEquipment();
      setAvailableEquipment(equipmentData);
      setLoadingEquipment(false);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment list");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (new Date(formData.dateCompleted) <= new Date(formData.dateReported)) {
      setError("End time must be after start time");
      return;
    }

    try {
      // Create maintenance request using the service
      const maintenanceRequest = {
        ...formData,
        dateReported: new Date().toISOString(),
        status: "reported",
        reportedBy: "Admin",
      };

      // Use the maintenance service
      await maintenanceService.create(maintenanceRequest);

      // Update equipment status to maintenance
      const selectedEquipment = availableEquipment.find(
        (e) => e.id === formData.equipmentId
      );
      if (selectedEquipment) {
        await fetch(`http://localhost:3001/equipment/${selectedEquipment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "maintenance",
            nextMaintenance: new Date().toISOString().split("T")[0],
          }),
        });
      }

      onSuccess();
      onClose();
      setSubmitting(false);
    } catch (err) {
      console.error("Error reporting maintenance:", err);
      setError("Failed to report maintenance. Please try again.");
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
                Report Maintenance Issue
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
                  Equipment *
                </label>
                {loadingEquipment ? (
                  <div className="flex items-center gap-2 p-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Loading equipment...
                    </span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.equipmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, equipmentId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200">
                    <option value="">Select equipment...</option>
                    {availableEquipment.map((equipment) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.name} ({equipment.type}, {equipment.status})
                        - {equipment.department}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Issue Type *
                  </label>
                  <select
                    required
                    value={formData.issueType}
                    onChange={(e) =>
                      setFormData({ ...formData, issueType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200">
                    <option value="routine">Routine Maintenance</option>
                    <option value="repair">Repair Needed</option>
                    <option value="emergency">Emergency Issue</option>
                    <option value="calibration">Calibration Required</option>
                    <option value="safety">Safety Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dateReported}
                    onChange={(e) =>
                      setFormData({ ...formData, dateReported: e.target.value })
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
                    value={formData.dateCompleted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateCompleted: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
                  rows="4"
                  placeholder="Describe the issue in detail..."
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
                disabled={submitting}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-lg flex-1 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors duration-200">
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Wrench className="w-4 h-4" />
                )}
                {submitting ? "Reporting..." : "Report Issue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportMaintenanceModal;
