import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Download, Plus } from "lucide-react";
import { getEquipment, deleteEquipment } from "../services/equipment.service";
import AddEquipmentModal from "../components/modals/AddEquipmentModal";
import EditEquipmentModal from "../components/modals/EditEquipmentModal";
import SuccessNotification from "../components/common/SuccessNotification";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/layout/PageHeader";
import EquipmentCard from "../components/equipment/EquipmentCard";
import EquipmentList from "../components/equipment/EquipmentList";
import EquipmentStatusBadge from "../components/equipment/EquipmentStatusBadge";
import FilterBar from "../components/maintenance/FilterBar";
import { getUniqueValues } from "../utils/equipment.utils";
import { STATUS_OPTIONS } from "../constants/equipment.constants";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    typeFilter: "all",
    departmentFilter: "all",
  });

  // Load equipment data
  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEquipment();
      setEquipment(data);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle equipment deletion
  const handleDeleteEquipment = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this equipment?")) {
        try {
          await deleteEquipment(id);
          setSuccessMessage("Equipment deleted successfully");
          loadEquipment();
        } catch (err) {
          console.error("Error deleting equipment:", err);
          setError("Failed to delete equipment");
        }
      }
    },
    [loadEquipment]
  );

  // Handle equipment edit
  const handleEditEquipment = useCallback((equipment) => {
    setEditingEquipment(equipment);
    setShowEditModal(true);
  }, []);

  // Handle successful actions
  const handleSuccess = useCallback(
    (message) => {
      setSuccessMessage(message);
      loadEquipment();
    },
    [loadEquipment]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      typeFilter: "all",
      departmentFilter: "all",
    });
  }, []);

  // Memoized calculations
  const uniqueTypes = useMemo(
    () => getUniqueValues(equipment, "type"),
    [equipment]
  );

  const uniqueDepartments = useMemo(
    () => getUniqueValues(equipment, "department"),
    [equipment]
  );

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (
          !item.name.toLowerCase().includes(searchLower) &&
          !item.type.toLowerCase().includes(searchLower) &&
          !item.department.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (
        filters.statusFilter !== "all" &&
        item.status !== filters.statusFilter
      ) {
        return false;
      }

      // Type filter
      if (filters.typeFilter !== "all" && item.type !== filters.typeFilter) {
        return false;
      }

      // Department filter
      if (
        filters.departmentFilter !== "all" &&
        item.department !== filters.departmentFilter
      ) {
        return false;
      }

      return true;
    });
  }, [equipment, filters]);

  // Filter configuration for FilterBar
  const filterConfig = useMemo(
    () => ({
      searchPlaceholder: "Search equipment...",
      filters: [
        {
          name: "statusFilter",
          label: "Status",
          options: STATUS_OPTIONS,
        },
        {
          name: "typeFilter",
          label: "Type",
          options: uniqueTypes.map((type) => ({ value: type, label: type })),
        },
        {
          name: "departmentFilter",
          label: "Department",
          options: uniqueDepartments.map((dept) => ({
            value: dept,
            label: dept,
          })),
        },
      ],
    }),
    [uniqueTypes, uniqueDepartments]
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: equipment.length,
      available: equipment.filter((e) => e.status === "available").length,
      inUse: equipment.filter((e) => e.status === "in_use").length,
      maintenance: equipment.filter((e) => e.status === "maintenance").length,
    }),
    [equipment]
  );

  // Loading state
  if (loading) {
    return <LoadingState message="Loading equipment data..." />;
  }

  return (
    <>
      <SuccessNotification
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <PageHeader
        title="Equipment Management"
        description="Manage all medical equipment in the system"
        actions={
          <>
            <Button variant="secondary" icon={Download}>
              Export
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}>
              Add Equipment
            </Button>
          </>
        }
      />

      {error && <ErrorState message={error} onRetry={loadEquipment} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Equipment
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.available}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Available
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.inUse}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">In Use</div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.maintenance}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Maintenance
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={filterConfig}
      />

      {/* Equipment List */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <EquipmentList
          filteredEquipment={filteredEquipment}
          equipment={equipment}
          error={error}
          onDelete={handleDeleteEquipment}
          onEdit={handleEditEquipment}
          onAddClick={() => setShowAddModal(true)}
          filters={filters}
        />
      </div>

      {/* Modals */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => handleSuccess("Equipment added successfully!")}
      />

      <EditEquipmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEquipment(null);
        }}
        onSuccess={() => handleSuccess("Equipment updated successfully!")}
        equipment={editingEquipment}
      />
    </>
  );
};

export default Equipment;
