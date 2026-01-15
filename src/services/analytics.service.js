import api from "./api";

export const analyticsService = {
  // Get all analytics data
  async getAll() {
    try {
      const response = await api.get("/analytics");
      return response;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  },

  // Get daily usage data
  async getDailyUsage() {
    try {
      const response = await api.get("/analytics");
      return response.dailyUsage || [];
    } catch (error) {
      console.error("Error fetching daily usage:", error);
      throw error;
    }
  },

  // Get department utilization
  async getDepartmentUtilization() {
    try {
      const response = await api.get("/analytics");
      return response.departmentUtilization || [];
    } catch (error) {
      console.error("Error fetching department utilization:", error);
      throw error;
    }
  },

  // Get equipment status stats
  async getEquipmentStatus() {
    try {
      const response = await api.get("/analytics");
      return response.equipmentStatus || {};
    } catch (error) {
      console.error("Error fetching equipment status:", error);
      throw error;
    }
  },

  // Get maintenance statistics
  async getMaintenanceStats() {
    try {
      const response = await api.get("/analytics");
      return response.maintenanceStats || {};
    } catch (error) {
      console.error("Error fetching maintenance stats:", error);
      throw error;
    }
  },

  // Get utilization trends
  async getUtilizationTrends() {
    try {
      const response = await api.get("/analytics");
      return response.utilizationTrends || {};
    } catch (error) {
      console.error("Error fetching utilization trends:", error);
      throw error;
    }
  },

  // Get maintenance costs
  async getMaintenanceCosts() {
    try {
      const response = await api.get("/analytics");
      return response.maintenanceCosts || {};
    } catch (error) {
      console.error("Error fetching maintenance costs:", error);
      throw error;
    }
  },

  // Get equipment count by type
  async getEquipmentByType() {
    try {
      const response = await api.get("/equipment");
      const equipment = response || [];

      const typeCounts = {};
      equipment.forEach((item) => {
        if (item.type) {
          typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
        }
      });

      return Object.entries(typeCounts).map(([type, count], index) => ({
        type,
        count,
        color: [
          "#3b82f6",
          "#10b981",
          "#8b5cf6",
          "#f59e0b",
          "#ef4444",
          "#ec4899",
          "#06b6d4",
        ][index % 7],
      }));
    } catch (error) {
      console.error("Error fetching equipment by type:", error);
      throw error;
    }
  },

  // Get maintenance completion times
  async getMaintenanceCompletionTimes() {
    try {
      const [maintenanceRes, equipmentRes] = await Promise.all([
        api.get("/maintenance"),
        api.get("/equipment"),
      ]);

      const maintenance = maintenanceRes || [];
      const equipment = equipmentRes || [];

      const completedMaintenance = maintenance.filter(
        (m) => m.status === "completed" && m.dateCompleted && m.dateReported
      );

      return completedMaintenance.map((item) => {
        const reported = new Date(item.dateReported);
        const completed = new Date(item.dateCompleted);
        const hours = Math.abs(completed - reported) / 36e5;

        const equipmentItem = equipment.find((e) => e.id === item.equipmentId);

        return {
          equipmentId: item.equipmentId,
          equipmentName: equipmentItem?.name || "Unknown",
          hours: Math.round(hours),
          priority: item.priority,
          issueType: item.issueType,
        };
      });
    } catch (error) {
      console.error("Error fetching maintenance completion times:", error);
      throw error;
    }
  },

  // Generate custom analytics report
  async generateReport(startDate, endDate) {
    try {
      const [equipmentRes, maintenanceRes, reservationsRes] = await Promise.all(
        [
          api.get("/equipment"),
          api.get("/maintenance"),
          api.get("/reservations"),
        ]
      );

      const equipment = equipmentRes || [];
      const maintenance = maintenanceRes || [];
      const reservations = reservationsRes || [];

      // Filter by date range
      const filteredMaintenance = maintenance.filter((item) => {
        const date = new Date(item.dateReported);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

      const filteredReservations = reservations.filter((item) => {
        const date = new Date(item.startTime);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

      // Calculate metrics
      const statusCounts = {};
      equipment.forEach((item) => {
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
      });

      const priorityCounts = {};
      filteredMaintenance.forEach((item) => {
        priorityCounts[item.priority] =
          (priorityCounts[item.priority] || 0) + 1;
      });

      const utilizationRate =
        equipment.length > 0
          ? Math.round(
              equipment.reduce(
                (sum, item) => sum + (item.utilizationRate || 0),
                0
              ) / equipment.length
            )
          : 0;

      const totalMaintenanceCost = filteredMaintenance.reduce(
        (sum, item) => sum + (item.cost || 0),
        0
      );

      const report = {
        period: {
          start: startDate,
          end: endDate,
          generatedAt: new Date().toISOString(),
        },
        summary: {
          totalEquipment: equipment.length,
          totalMaintenance: filteredMaintenance.length,
          totalReservations: filteredReservations.length,
          avgUtilization: utilizationRate,
          totalMaintenanceCost: totalMaintenanceCost,
        },
        equipment: {
          byStatus: statusCounts,
          byDepartment: this.groupByDepartment(equipment),
          byType: this.groupByType(equipment),
        },
        maintenance: {
          byPriority: priorityCounts,
          byStatus: this.groupByStatus(filteredMaintenance),
          byIssueType: this.groupByIssueType(filteredMaintenance),
        },
        reservations: {
          byStatus: this.groupReservationsByStatus(filteredReservations),
          byEquipment: this.groupReservationsByEquipment(filteredReservations),
        },
      };

      return report;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  },

  // Helper methods
  groupByDepartment(equipment) {
    const deptCounts = {};
    equipment.forEach((item) => {
      deptCounts[item.department] = (deptCounts[item.department] || 0) + 1;
    });
    return deptCounts;
  },

  groupByType(equipment) {
    const typeCounts = {};
    equipment.forEach((item) => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    return typeCounts;
  },

  groupByStatus(maintenance) {
    const statusCounts = {};
    maintenance.forEach((item) => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    return statusCounts;
  },

  groupByIssueType(maintenance) {
    const issueCounts = {};
    maintenance.forEach((item) => {
      issueCounts[item.issueType] = (issueCounts[item.issueType] || 0) + 1;
    });
    return issueCounts;
  },

  groupReservationsByStatus(reservations) {
    const statusCounts = {};
    reservations.forEach((item) => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    return statusCounts;
  },

  groupReservationsByEquipment(reservations) {
    const equipmentCounts = {};
    reservations.forEach((item) => {
      equipmentCounts[item.equipmentId] =
        (equipmentCounts[item.equipmentId] || 0) + 1;
    });
    return equipmentCounts;
  },

  // Get real-time dashboard stats
  async getDashboardStats() {
    try {
      const [equipmentRes, maintenanceRes, reservationsRes] = await Promise.all(
        [
          api.get("/equipment"),
          api.get("/maintenance"),
          api.get("/reservations"),
        ]
      );

      const equipment = equipmentRes || [];
      const maintenance = maintenanceRes || [];
      const reservations = reservationsRes || [];

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Active maintenance
      const activeMaintenance = maintenance.filter(
        (m) => m.status !== "completed" && m.status !== "cancelled"
      );

      // Urgent maintenance
      const urgentMaintenance = maintenance.filter(
        (m) => m.priority === "urgent" || m.priority === "high"
      );

      // Today's reservations
      const todaysReservations = reservations.filter((r) =>
        r.startTime.startsWith(today)
      );

      // Equipment needing maintenance soon (within 7 days)
      const upcomingMaintenance = equipment.filter((e) => {
        if (!e.nextMaintenance) return false;
        const maintenanceDate = new Date(e.nextMaintenance);
        const daysUntil = (maintenanceDate - now) / (1000 * 60 * 60 * 24);
        return daysUntil <= 7 && daysUntil > 0;
      });

      return {
        equipment: {
          total: equipment.length,
          available: equipment.filter((e) => e.status === "available").length,
          inUse: equipment.filter((e) => e.status === "in_use").length,
          underMaintenance: equipment.filter((e) => e.status === "maintenance")
            .length,
        },
        maintenance: {
          total: maintenance.length,
          active: activeMaintenance.length,
          urgent: urgentMaintenance.length,
          completed: maintenance.filter((m) => m.status === "completed").length,
        },
        reservations: {
          total: reservations.length,
          today: todaysReservations.length,
          upcoming: reservations.filter((r) => new Date(r.startTime) > now)
            .length,
        },
        alerts: {
          upcomingMaintenance: upcomingMaintenance.length,
          urgentIssues: urgentMaintenance.length,
          equipmentDown: equipment.filter((e) => e.status === "maintenance")
            .length,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getAnalytics = () => analyticsService.getAll();
export const getDepartmentAnalytics = () =>
  analyticsService.getDepartmentUtilization();
export const getMaintenanceAnalytics = () =>
  analyticsService.getMaintenanceStats();
export const getDashboardStats = () => analyticsService.getDashboardStats();
export const generateAnalyticsReport = (startDate, endDate) =>
  analyticsService.generateReport(startDate, endDate);
