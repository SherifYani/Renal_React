import React from "react";
import { STATS_COLORS } from "../../constants/maintenance.constants";

const StatusCards = ({ maintenanceRequests }) => {
  const stats = {
    total: maintenanceRequests.length,
    reported: maintenanceRequests.filter((r) => r.status === "reported").length,
    in_progress: maintenanceRequests.filter((r) => r.status === "in_progress")
      .length,
    completed: maintenanceRequests.filter((r) => r.status === "completed")
      .length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className={`text-2xl font-bold ${STATS_COLORS.total}`}>
          {stats.total}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Requests
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className={`text-2xl font-bold ${STATS_COLORS.reported}`}>
          {stats.reported}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Reported</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className={`text-2xl font-bold ${STATS_COLORS.in_progress}`}>
          {stats.in_progress}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          In Progress
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className={`text-2xl font-bold ${STATS_COLORS.completed}`}>
          {stats.completed}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Completed
        </div>
      </div>
    </div>
  );
};

export default StatusCards;
