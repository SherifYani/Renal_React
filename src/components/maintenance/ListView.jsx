import React from "react";
import { Wrench, AlertTriangle, CalendarIcon, ToolCase } from "lucide-react";
import {
  formatDate,
  getStatusBadgeClasses,
  getPriorityBadgeClasses,
} from "../../utils/maintenance.utils";

const MaintenanceListItem = ({ request, equipment, onUpdateStatus }) => (
  <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {equipment.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {equipment.type} • {equipment.department}
        </p>
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClasses(
            request.priority
          )}`}>
          {request.priority}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(
            request.status
          )}`}>
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
          <CalendarIcon className="w-4 h-4" />
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
            onClick={() => onUpdateStatus(request.id, "in_progress")}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200">
            Start Work
          </button>
        )}
        {request.status === "in_progress" && (
          <button
            onClick={() => onUpdateStatus(request.id, "completed")}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200">
            Mark Complete
          </button>
        )}
      </div>
    </div>
  </div>
);

const ListView = ({ requests, equipmentMap, onUpdateStatus }) => {
  const activeRequests = requests.filter((r) => r.status !== "completed");

  if (activeRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No active maintenance requests
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          All equipment is operational
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Active Maintenance Requests
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {activeRequests.length} active
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activeRequests.map((request) => (
          <MaintenanceListItem
            key={request.id}
            request={request}
            equipment={
              equipmentMap[request.equipmentId] || {
                name: `Equipment #${request.equipmentId}`,
                type: "Unknown",
                department: "Unknown",
              }
            }
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ListView;
