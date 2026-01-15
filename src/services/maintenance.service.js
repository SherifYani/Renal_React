import api from "./api";

export const maintenanceService = {
  // Get all maintenance requests
  async getAll() {
    try {
      const response = await api.get("/maintenance");
      return response;
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      throw error;
    }
  },

  // Get maintenance request by ID
  async getById(id) {
    try {
      const response = await api.get(`/maintenance/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching maintenance request ${id}:`, error);
      throw error;
    }
  },

  // Create new maintenance request
  async create(maintenanceData) {
    try {
      const response = await api.post("/maintenance", maintenanceData);
      return response;
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      throw error;
    }
  },

  // Update maintenance request (PUT - full update)
  async update(id, maintenanceData) {
    try {
      const response = await api.put(`/maintenance/${id}`, maintenanceData);
      return response;
    } catch (error) {
      console.error(`Error updating maintenance request ${id}:`, error);
      throw error;
    }
  },

  // Partial update maintenance request (PATCH)
  async patch(id, updates) {
    try {
      const response = await api.patch(`/maintenance/${id}`, updates);
      return response;
    } catch (error) {
      console.error(`Error patching maintenance request ${id}:`, error);
      throw error;
    }
  },

  // Delete maintenance request
  async delete(id) {
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting maintenance request ${id}:`, error);
      throw error;
    }
  },

  // Get maintenance requests by equipment ID
  async getByEquipmentId(equipmentId) {
    try {
      const response = await api.get(`/maintenance?equipmentId=${equipmentId}`);
      return response;
    } catch (error) {
      console.error(
        `Error fetching maintenance requests for equipment ${equipmentId}:`,
        error
      );
      throw error;
    }
  },

  // Get maintenance requests by status
  async getByStatus(status) {
    try {
      const response = await api.get(`/maintenance?status=${status}`);
      return response;
    } catch (error) {
      console.error(
        `Error fetching maintenance requests with status ${status}:`,
        error
      );
      throw error;
    }
  },

  // Get maintenance requests by priority
  async getByPriority(priority) {
    try {
      const response = await api.get(`/maintenance?priority=${priority}`);
      return response;
    } catch (error) {
      console.error(
        `Error fetching maintenance requests with priority ${priority}:`,
        error
      );
      throw error;
    }
  },

  // Get active maintenance requests (not completed)
  async getActive() {
    try {
      const response = await api.get("/maintenance");
      return Array.isArray(response)
        ? response.filter((request) => request.status !== "completed")
        : [];
    } catch (error) {
      console.error("Error fetching active maintenance requests:", error);
      throw error;
    }
  },

  // Get completed maintenance requests
  async getCompleted() {
    try {
      const response = await api.get("/maintenance");
      return Array.isArray(response)
        ? response.filter((request) => request.status === "completed")
        : [];
    } catch (error) {
      console.error("Error fetching completed maintenance requests:", error);
      throw error;
    }
  },

  // Search maintenance requests by description
  async search(searchTerm) {
    try {
      const response = await api.get(
        `/maintenance?description_like=${searchTerm}`
      );
      return response;
    } catch (error) {
      console.error(`Error searching maintenance requests:`, error);
      throw error;
    }
  },

  // Get sorted maintenance requests
  async getSorted(sortBy, order = "asc") {
    try {
      const response = await api.get(
        `/maintenance?_sort=${sortBy}&_order=${order}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching sorted maintenance requests:", error);
      throw error;
    }
  },

  // Get maintenance requests by issue type
  async getByIssueType(issueType) {
    try {
      const response = await api.get(`/maintenance?issueType=${issueType}`);
      return response;
    } catch (error) {
      console.error(
        `Error fetching maintenance requests with issue type ${issueType}:`,
        error
      );
      throw error;
    }
  },

  // Get maintenance requests from date range
  async getByDateRange(startDate, endDate) {
    try {
      const response = await api.get("/maintenance");
      return Array.isArray(response)
        ? response.filter((request) => {
            if (!request.dateReported) return false;
            const requestDate = new Date(request.dateReported);
            return (
              requestDate >= new Date(startDate) &&
              requestDate <= new Date(endDate)
            );
          })
        : [];
    } catch (error) {
      console.error(
        "Error fetching maintenance requests by date range:",
        error
      );
      throw error;
    }
  },

  // Get urgent maintenance requests (high or urgent priority)
  async getUrgent() {
    try {
      const response = await api.get("/maintenance");
      return Array.isArray(response)
        ? response.filter(
            (request) =>
              request.priority === "urgent" || request.priority === "high"
          )
        : [];
    } catch (error) {
      console.error("Error fetching urgent maintenance requests:", error);
      throw error;
    }
  },
};

// Also export individual functions for backward compatibility
export const getMaintenanceRequests = () => maintenanceService.getAll();
export const getMaintenanceRequestById = (id) => maintenanceService.getById(id);
export const createMaintenanceRequest = (maintenanceData) =>
  maintenanceService.create(maintenanceData);
export const updateMaintenanceRequest = (id, maintenanceData) =>
  maintenanceService.update(id, maintenanceData);
export const patchMaintenanceRequest = (id, updates) =>
  maintenanceService.patch(id, updates);
export const deleteMaintenanceRequest = (id) => maintenanceService.delete(id);
