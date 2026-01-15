import { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Wrench,
  MapPin,
  Building,
} from "lucide-react";

const EquipmentCard = ({ equipment, onDelete, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Status colors and icons
  const getStatusInfo = (status) => {
    switch (status) {
      case "available":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          label: "Available",
        };
      case "in_use":
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          label: "In Use",
        };
      case "maintenance":
        return {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          label: "Maintenance",
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          label: status,
        };
    }
  };

  const statusInfo = getStatusInfo(equipment.status);

  // Check if maintenance is due soon
  const isMaintenanceDue = () => {
    if (!equipment.nextMaintenance) return false;
    const dueDate = new Date(equipment.nextMaintenance);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return dueDate <= nextWeek && dueDate >= today;
  };

  const isMaintenanceOverdue = () => {
    if (!equipment.nextMaintenance) return false;
    const dueDate = new Date(equipment.nextMaintenance);
    const today = new Date();
    return dueDate < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {equipment.type}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>

        {/* Equipment Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Building className="w-4 h-4 mr-2" />
            <span>{equipment.department || "No department"}</span>
          </div>

          {equipment.location && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{equipment.location}</span>
            </div>
          )}

          {equipment.purchaseDate && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Purchased: {formatDate(equipment.purchaseDate)}</span>
            </div>
          )}

          {equipment.nextMaintenance && (
            <div
              className={`flex items-center text-sm ${
                isMaintenanceOverdue()
                  ? "text-red-600 dark:text-red-400"
                  : isMaintenanceDue()
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}>
              <Wrench className="w-4 h-4 mr-2" />
              <span>
                Maintenance: {formatDate(equipment.nextMaintenance)}
                {isMaintenanceOverdue() && " (Overdue)"}
                {isMaintenanceDue() && !isMaintenanceOverdue() && " (Due Soon)"}
              </span>
            </div>
          )}

          {/* Utilization Rate */}
          <div className="pt-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Utilization Rate</span>
              <span>{equipment.utilizationRate || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${equipment.utilizationRate || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            <Eye className="w-4 h-4" />
            Details
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(equipment)}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              title="Edit Equipment">
              <Edit className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => onDelete(equipment.id)}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
              title="Delete Equipment">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700/50 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Additional Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Serial Number</p>
              <p className="text-gray-900 dark:text-white">
                {equipment.serialNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Model</p>
              <p className="text-gray-900 dark:text-white">
                {equipment.model || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Manufacturer</p>
              <p className="text-gray-900 dark:text-white">
                {equipment.manufacturer || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Last Service</p>
              <p className="text-gray-900 dark:text-white">
                {equipment.lastServiceDate
                  ? formatDate(equipment.lastServiceDate)
                  : "N/A"}
              </p>
            </div>
          </div>

          {equipment.notes && (
            <div className="mt-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Notes
              </p>
              <p className="text-gray-900 dark:text-white text-sm">
                {equipment.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;
