// Color constants using Tailwind CSS
export const STATUS_COLORS = {
  reported: {
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    calendar: "#eab308", // yellow-500
    text: "text-yellow-600 dark:text-yellow-400",
  },
  in_progress: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    calendar: "#3b82f6", // blue-500
    text: "text-blue-600 dark:text-blue-400",
  },
  completed: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    calendar: "#22c55e", // green-500
    text: "text-green-600 dark:text-green-400",
  },
};

export const PRIORITY_COLORS = {
  urgent: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    calendar: "#ef4444", // red-500
  },
  high: {
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    calendar: "#f97316", // orange-500
  },
  medium: {
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    calendar: "#eab308", // yellow-500
  },
  low: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    calendar: "#3b82f6", // blue-500
  },
};

export const STATS_COLORS = {
  total: "text-gray-900 dark:text-white",
  reported: "text-yellow-600 dark:text-yellow-400",
  in_progress: "text-blue-600 dark:text-blue-400",
  completed: "text-green-600 dark:text-green-400",
};

export const STATUS_OPTIONS = [
  { value: "reported", label: "Reported" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];
