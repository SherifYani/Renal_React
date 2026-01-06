import React from "react";
import {
  formatDate,
  getStatusBadgeClasses,
  getPriorityBadgeClasses,
} from "../../utils/maintenance.utils";

const EventDetailsModal = ({ event, onClose, onUpdateStatus }) => {
  if (!event) return null;

  const {
    equipment,
    status,
    priority,
    description,
    dateReported,
    dateCompleted,
  } = event;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Maintenance Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Equipment Info */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment
            </h4>
            <p className="text-lg text-gray-900 dark:text-white">
              {equipment?.name || `Equipment #${event.equipmentId}`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {equipment?.type} • {equipment?.department}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h4>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </h4>
              <span
                className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusBadgeClasses(
                  status
                )}`}>
                {status}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </h4>
              <span
                className={`px-3 py-1.5 text-sm font-medium rounded-full ${getPriorityBadgeClasses(
                  priority
                )}`}>
                {priority}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reported On
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {formatDate(dateReported)}
              </p>
            </div>
            {dateCompleted && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Completed On
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {formatDate(dateCompleted)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {status !== "completed" && (
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {status === "reported" && (
                <button
                  onClick={() => {
                    onUpdateStatus(event.id, "in_progress");
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium">
                  Start Work
                </button>
              )}
              {status === "in_progress" && (
                <button
                  onClick={() => {
                    onUpdateStatus(event.id, "completed");
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors font-medium">
                  Mark Complete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
