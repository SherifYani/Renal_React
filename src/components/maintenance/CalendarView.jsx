import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

const CalendarView = ({ events, onEventClick, onDateClick }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    // Force calendar to update when theme changes
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.render();
    }
  }, []);

  return (
    <div className="maintenance-calendar bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
      <style jsx="true">{`
        /* Light mode - FullCalendar defaults */
        .maintenance-calendar .fc {
          --fc-border-color: #e5e7eb;
          --fc-button-bg-color: #3b82f6;
          --fc-button-border-color: #3b82f6;
          --fc-button-hover-bg-color: #2563eb;
          --fc-button-hover-border-color: #2563eb;
          --fc-button-active-bg-color: #1d4ed8;
          --fc-button-active-border-color: #1d4ed8;
          --fc-page-bg-color: #ffffff;
          --fc-neutral-bg-color: #f9fafb;
          --fc-neutral-text-color: #374151;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
        }

        .maintenance-calendar .fc .fc-toolbar-title {
          color: #111827;
        }

        .maintenance-calendar .fc .fc-col-header-cell-cushion {
          color: #111827;
        }

        .maintenance-calendar .fc .fc-daygrid-day-number {
          color: #374151;
        }

        .maintenance-calendar .fc .fc-button {
          color: #ffffff;
        }

        /* Dark mode overrides */
        .dark .maintenance-calendar .fc {
          --fc-border-color: #374151;
          --fc-button-bg-color: #374151;
          --fc-button-border-color: #4b5563;
          --fc-button-hover-bg-color: #4b5563;
          --fc-button-hover-border-color: #6b7280;
          --fc-button-active-bg-color: #6b7280;
          --fc-button-active-border-color: #6b7280;
          --fc-page-bg-color: #1f2937;
          --fc-neutral-bg-color: #111827;
          --fc-neutral-text-color: #d1d5db;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
        }

        .dark .maintenance-calendar .fc .fc-toolbar-title {
          color: #f3f4f6;
        }

        .dark .maintenance-calendar .fc .fc-col-header-cell-cushion {
          color: #f3f4f6;
        }

        .dark .maintenance-calendar .fc .fc-daygrid-day-number {
          color: #d1d5db;
        }

        .dark .maintenance-calendar .fc .fc-timegrid-axis-cushion {
          color: #d1d5db;
        }

        .dark .maintenance-calendar .fc .fc-list-day-text,
        .dark .maintenance-calendar .fc .fc-list-day-side-text {
          color: #f3f4f6;
        }

        .dark .maintenance-calendar .fc .fc-list-event-time {
          color: #d1d5db;
        }

        .dark .maintenance-calendar .fc .fc-list-event-title {
          color: #f3f4f6;
        }

        .dark .maintenance-calendar .fc-theme-standard .fc-scrollgrid,
        .dark .maintenance-calendar .fc-theme-standard td,
        .dark .maintenance-calendar .fc-theme-standard th {
          border-color: var(--fc-border-color);
        }

        .dark .maintenance-calendar .fc .fc-button {
          color: #f3f4f6;
        }

        .dark .maintenance-calendar .fc .fc-button-primary:disabled {
          background-color: #6b7280;
          border-color: #6b7280;
          color: #9ca3af;
        }

        .dark .maintenance-calendar .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(59, 130, 246, 0.15);
        }

        .dark .maintenance-calendar .fc .fc-highlight {
          background-color: rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        height="70vh"
        eventDisplay="block"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        eventContent={(eventInfo) => {
          const eventData = eventInfo.event.extendedProps;
          return (
            <div className="p-1 truncate">
              <div className="font-medium text-sm">{eventInfo.event.title}</div>
              <div className="text-xs opacity-90">
                {eventData.status} • {eventData.priority}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarView;
