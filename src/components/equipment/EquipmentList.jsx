import { Search } from "lucide-react";
import EquipmentCard from "./EquipmentCard";
import Button from "../common/Button";
import ErrorState from "../common/ErrorState";
const EquipmentList = ({
  filteredEquipment,
  equipment,
  error,
  onDelete,
  onEdit,
  onAddClick,
  filters,
}) => {
  const { searchTerm } = filters;

  if (filteredEquipment.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No equipment found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {searchTerm
            ? "Try adjusting your search or filters"
            : "No equipment available in the system"}
        </p>
        <Button variant="primary" onClick={onAddClick}>
          Add First Equipment
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Equipment List
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorState message={error} compact />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <EquipmentCard
            key={item.id}
            equipment={item}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
