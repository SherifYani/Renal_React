// components/equipment/EquipmentList.jsx
import { useState, useEffect } from "react";
import {
  getEquipment,
  deleteEquipment,
} from "../../services/equipment.service";
import EquipmentCard from "./EquipmentCard";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await getEquipment();
      setEquipment(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } 
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        deleteEquipment(id);
        // Remove from local state
        setEquipment(equipment.filter((item) => item.id !== id));
      } catch (err) {
        alert("Failed to delete equipment");
        console.error("Error deleting equipment:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading equipment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Medical Equipment</h2>
        <button
          onClick={() => {
            /* Open add equipment form */
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <EquipmentCard
            key={item.id}
            equipment={item}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No equipment found. Add some equipment to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
