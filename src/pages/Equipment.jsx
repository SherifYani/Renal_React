import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { getEquipment, deleteEquipment } from "../services/equipment.service";
import EquipmentCard from "../components/equipment/EquipmentCard";
import AddEquipmentModal from "../components/modals/AddEquipmentModal";
import EditEquipmentModal from "../components/modals/EditEquipmentModal";
import SuccessNotification from "../components/common/SuccessNotification";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, statusFilter, typeFilter, departmentFilter]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await getEquipment();
      setEquipment(data);
      setFilteredEquipment(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment data");
    }
  };

  const filterEquipment = () => {
    let filtered = [...equipment];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.department === departmentFilter
      );
    }

    setFilteredEquipment(filtered);
  };

  const handleDeleteEquipment = async (id) => {
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
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setShowEditModal(true);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    loadEquipment();
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return [...new Set(equipment.map((item) => item[key]))].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-700 dark:text-blue-200">
            Loading equipment data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Equipment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all medical equipment in the system
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
            <Plus className="w-4 h-4" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {equipment.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Equipment
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {equipment.filter((e) => e.status === "available").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Available
          </div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {equipment.filter((e) => e.status === "in_use").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">In Use</div>
        </div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {equipment.filter((e) => e.status === "maintenance").length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Maintenance
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Types</option>
              {getUniqueValues("type").map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Departments</option>
              {getUniqueValues("department").map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
                setDepartmentFilter("all");
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Equipment List ({filteredEquipment.length} items)
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {filteredEquipment.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No equipment found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "No equipment available in the system"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
              Add First Equipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onDelete={handleDeleteEquipment}
                onEdit={handleEditEquipment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => handleSuccess("Equipment added successfully!")}
      />

      {/* Edit Equipment Modal */}
      <EditEquipmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEquipment(null);
        }}
        onSuccess={() => handleSuccess("Equipment updated successfully!")}
        equipment={editingEquipment}
      />
    </div>
  );
};

export default Equipment;
