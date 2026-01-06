import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function MaintenanceCalendar({ events, onDateSelect }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={true}
      events={events}
      select={onDateSelect}
    />
  );
}
export default MaintenanceCalendar;
