// components/equipment/EquipmentCard.jsx
import React from "react";
import { Activity, Calendar, MapPin, Trash2, Edit } from "lucide-react";
import EquipmentStatusBadge from "./EquipmentStatusBadge";

const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
  const handleEdit = () => {
    if (onEdit) onEdit(equipment);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(equipment.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {equipment.manufacturer} • {equipment.model}
            </p>
          </div>
          <EquipmentStatusBadge status={equipment.status} />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {equipment.location} • {equipment.department}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Activity className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Serial: {equipment.serialNumber}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Next Maintenance:{" "}
              {new Date(equipment.nextMaintenance).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Utilization */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">
              Utilization
            </span>
            <span className="font-medium">{equipment.utilization}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${equipment.utilization}%` }}></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleEdit}
            className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
