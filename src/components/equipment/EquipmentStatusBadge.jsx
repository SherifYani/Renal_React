const EquipmentStatusBadge = ({ status }) => {
  const statusConfig = {
    available: {
      label: "Available",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    in_use: {
      label: "In Use",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    maintenance: {
      label: "Maintenance",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    reserved: {
      label: "Reserved",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  };

  const config = statusConfig[status] || {
    label: "Unknown",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default EquipmentStatusBadge;
