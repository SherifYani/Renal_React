import {
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "../constants/maintenance.constants";

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getStatusBadgeClasses = (status) => {
  return STATUS_COLORS[status]?.badge || STATUS_COLORS.reported.badge;
};

export const getPriorityBadgeClasses = (priority) => {
  return PRIORITY_COLORS[priority]?.badge || PRIORITY_COLORS.low.badge;
};

export const getEventColor = (request) => {
  if (request.status === "completed") return STATUS_COLORS.completed.calendar;
  if (PRIORITY_COLORS[request.priority])
    return PRIORITY_COLORS[request.priority].calendar;
  return (
    STATUS_COLORS[request.status]?.calendar || STATUS_COLORS.reported.calendar
  );
};
