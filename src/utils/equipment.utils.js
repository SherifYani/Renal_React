export const filterEquipment = (equipment, filters) => {
  const { searchTerm, statusFilter, typeFilter, departmentFilter } = filters;

  return equipment.filter((item) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !item.name.toLowerCase().includes(searchLower) &&
        !item.type.toLowerCase().includes(searchLower) &&
        !item.department.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter !== "all" && item.type !== typeFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== "all" && item.department !== departmentFilter) {
      return false;
    }

    return true;
  });
};

export const getUniqueValues = (array, key) => {
  return [...new Set(array.map((item) => item[key]))].filter(Boolean);
};
