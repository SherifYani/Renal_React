import api from "./api";

export const getEquipment = () => {
  return api.get("/equipment");
};

export const getEquipmentById = (id) => {
  return api.get(`/equipment/${id}`);
};

export const createEquipment = (equipmentData) => {
  return api.post("/equipment", equipmentData);
};

export const updateEquipment = (id, equipmentData) => {
  return api.put(`/equipment/${id}`, equipmentData); 
};

export const patchEquipment = (id, updates) => {
  return api.patch(`/equipment/${id}`, updates);
};

export const deleteEquipment = (id) => {
  return api.delete(`/equipment/${id}`);
};

export const getEquipmentByStatus = (status) => {
  return api.get(`/equipment?status=${status}`);
};

export const searchEquipment = (searchTerm) => {
  return api.get(`/equipment?name_like=${searchTerm}`);
};

export const getEquipmentByType = (type) => {
  return api.get(`/equipment?type=${type}`);
};

export const getSortedEquipment = (sortBy, order = "asc") => {
  return api.get(`/equipment?_sort=${sortBy}&_order=${order}`);
};