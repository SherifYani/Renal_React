import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { getEquipment } from "../services/equipment.service";
import ReportMaintenanceModal from "../components/modals/ReportMaintenanceModal";
import SuccessNotification from "../components/common/SuccessNotification";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import PageHeader from "../components/layout/PageHeader";
import FilterBar from "../components/maintenance/FilterBar";
import ListView from "../components/maintenance/ListView";
import CalendarView from "../components/maintenance/CalendarView";
import EventDetailsModal from "../components/maintenance/EventDetailsModal";
import ViewToggle from "../components/maintenance/ViewToggle";
import StatusCards from "../components/maintenance/StatusCards";
import { getEventColor } from "../utils/maintenance.utils";
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "../constants/maintenance.constants";

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("list");
  const [showReportModal, setShowReportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",
  });

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

  const handleSuccess = useCallback(
    (message) => {
      setSuccessMessage(message);
      loadData();
    },
    [loadData]
  );

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      priorityFilter: "all",
    });
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
      if (
        filters.searchTerm &&
        !request.description
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.statusFilter !== "all" &&
        request.status !== filters.statusFilter
      ) {
        return false;
      }

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

  // Filter configuration
  const filterConfig = useMemo(
    () => ({
      searchPlaceholder: "Search maintenance requests...",
      filters: [
        {
          name: "statusFilter",
          label: "Status",
          options: STATUS_OPTIONS,
        },
        {
          name: "priorityFilter",
          label: "Priority",
          options: PRIORITY_OPTIONS,
        },
      ],
    }),
    []
  );

  // Event handlers
  const handleEventClick = useCallback((clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setShowEventModal(true);
  }, []);

  const handleDateClick = useCallback(() => {
    setShowReportModal(true);
  }, []);

  if (loading) {
    return <LoadingState message="Loading maintenance data..." />;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <SuccessNotification
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <PageHeader
        title="Maintenance Tracking"
        description="Track and manage equipment maintenance requests"
        actions={
          <>
            <Button variant="secondary" icon={RefreshCw} onClick={loadData}>
              Refresh
            </Button>
            <Button
              variant="warning"
              icon={Plus}
              onClick={() => setShowReportModal(true)}>
              Report Maintenance
            </Button>
          </>
        }
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* Stats Cards */}
      <StatusCards maintenanceRequests={maintenanceRequests} />

      {/* View Toggle */}
      <div className="mb-6">
        <ViewToggle currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={filterConfig}
      />

      {/* Content */}
      {currentView === "calendar" ? (
        <CalendarView
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      ) : (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ListView
            requests={filteredRequests}
            equipmentMap={equipmentMap}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
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
