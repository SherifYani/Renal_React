import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { getEquipment } from "../services/equipment.service";
import ReportMaintenanceModal from "../components/modals/ReportMaintenanceModal";
import SuccessNotification from "../components/common/SuccessNotification";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import StatusCards from "../components/maintenance/StatusCards";
import FilterBar from "../components/maintenance/FilterBar";
import ViewToggle from "../components/maintenance/ViewToggle";
import ListView from "../components/maintenance/ListView";
import CalendarView from "../components/maintenance/CalendarView";
import EventDetailsModal from "../components/maintenance/EventDetailsModal";
import { formatDate, getEventColor } from "../utils/maintenance.utils";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "../constants/maintenance.constants";

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("list");

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const equipmentData = await getEquipment();
      setEquipment(equipmentData);

      const response = await fetch("http://localhost:3001/maintenance");
      if (response.ok) {
        const maintenanceData = await response.json();
        setMaintenanceRequests(
          Array.isArray(maintenanceData) ? maintenanceData : []
        );
      } else {
        setMaintenanceRequests([]);
      }
    } catch (err) {
      console.error("Error loading maintenance data:", err);
      setError("Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle status update
  const handleUpdateStatus = useCallback(
    async (id, status) => {
      try {
        await fetch(`http://localhost:3001/maintenance/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (status === "completed") {
          const request = maintenanceRequests.find((r) => r.id === id);
          if (request) {
            await fetch(
              `http://localhost:3001/equipment/${request.equipmentId}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "available",
                  nextMaintenance: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                  )
                    .toISOString()
                    .split("T")[0],
                }),
              }
            );
          }
        }

        setSuccessMessage(`Maintenance request marked as ${status}`);
        loadData();
      } catch (err) {
        console.error("Error updating maintenance status:", err);
        setError("Failed to update maintenance status");
      }
    },
    [maintenanceRequests, loadData]
  );

  // Handle successful actions
  const handleSuccess = useCallback(
    (message) => {
      setSuccessMessage(message);
      loadData();
    },
    [loadData]
  );

  // Update filter
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      priorityFilter: "all",
    });
  }, []);

  // Event handlers for calendar
  const handleEventClick = useCallback((clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setShowEventModal(true);
  }, []);

  const handleDateClick = useCallback(() => {
    setShowReportModal(true);
  }, []);

  // Memoized calculations
  const equipmentMap = useMemo(() => {
    return equipment.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [equipment]);

  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter((request) => {
      // Search filter
      if (
        filters.searchTerm &&
        !request.description
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (
        filters.statusFilter !== "all" &&
        request.status !== filters.statusFilter
      ) {
        return false;
      }

      // Priority filter
      if (
        filters.priorityFilter !== "all" &&
        request.priority !== filters.priorityFilter
      ) {
        return false;
      }

      return true;
    });
  }, [maintenanceRequests, filters]);

  const calendarEvents = useMemo(() => {
    return filteredRequests.map((request) => {
      const equipmentData = equipmentMap[request.equipmentId] || {
        name: `Equipment #${request.equipmentId}`,
        type: "Unknown",
        department: "Unknown",
      };

      return {
        id: request.id,
        title: `${equipmentData.name}: ${request.issueType}`,
        start: request.dateReported,
        end: request.dateCompleted || request.estimatedCompletion || null,
        color: getEventColor(request),
        textColor: "#ffffff",
        extendedProps: {
          ...request,
          equipment: equipmentData,
        },
      };
    });
  }, [filteredRequests, equipmentMap]);

  // Loading state
  if (loading) {
    return <LoadingState message="Loading maintenance data..." />;
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
            Maintenance Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage equipment maintenance requests
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200">
            <Plus className="w-4 h-4" />
            Report Maintenance
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* Stats Cards */}
      <StatusCards maintenanceRequests={maintenanceRequests} />

      {/* View Toggle */}
      <ViewToggle currentView={currentView} setCurrentView={setCurrentView} />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Content */}
      {currentView === "calendar" ? (
        <CalendarView
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      ) : (
        <ListView
          requests={filteredRequests}
          equipmentMap={equipmentMap}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Modals */}
      <ReportMaintenanceModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={() => handleSuccess("Maintenance reported successfully!")}
      />

      {showEventModal && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default Maintenance;
