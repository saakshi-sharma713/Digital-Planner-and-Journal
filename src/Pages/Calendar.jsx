import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../Components/EventModal";

const Calendar = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const pastelColors = ["#f87171","#60a5fa","#34d399","#fbbf24","#c084fc","#fb7185"];

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (info) => {
  const title = prompt("Enter Event Title");
  const time = prompt("Enter Time (HH:MM)");
  if (!title || !time) return;

  const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
  const date = new Date(`${info.dateStr} ${time}`);
  const hours = String(date.getHours()).padStart(2,"0");
  const minutes = String(date.getMinutes()).padStart(2,"0");
  console.log(hours)
  const timeOnly = `${hours}:${minutes}`
  setEvents([...events, {
    id: Date.now().toString(),
    title,
    start: date,   // ✅ Date object
    time:timeOnly,          // ✅ keep time string
    backgroundColor: randomColor,
    textColor: "#fff",
  }]);
};

const handleEventClick = (info) => {
  setEditingEvent({
    id: info.event.id,
    title: info.event.title,
    start: info.event.start,
    time: info.event.extendedProps.time, // ✅ use stored time directly
    backgroundColor: info.event.backgroundColor,
  });
};

const handleEventDrop = (info) => {
  setEvents(events.map(e =>
    e.id === info.event.id ? { ...e, start: info.event.start } : e
  ));
};

const saveEditedEvent = (updatedEvent) => {
  const oldEvent = events.find(e => e.id === updatedEvent.id);

  // Check if anything changed
  if (updatedEvent.title === oldEvent.title && updatedEvent.time === oldEvent.time) {
    setEditingEvent(null); // nothing changed
    return;
  }

  // Build new Date with updated time
  const datePart = oldEvent.start.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const newDate = new Date(`${datePart} ${updatedEvent.time}`);

  setEvents(events.map(e =>
    e.id === updatedEvent.id
      ? { ...e, title: updatedEvent.title, start: newDate, time: updatedEvent.time }
      : e
  ));
  setEditingEvent(null);
};

const cancelEdit = (action) => {
  if (action === "delete" && editingEvent) {
    setEvents(events.filter((e) => e.id !== editingEvent.id));
  }
  setEditingEvent(null);
};

  // Conditional rendering
  if (editingEvent) {
    return (
      <EventModal
        event={editingEvent}
        onSave={saveEditedEvent}
        onCancel={cancelEdit}
      
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-sky-100 via-white to-blue-100">
      
  <div className="w-full max-w-full sm:max-w-6xl bg-white shadow-2xl rounded-xl p-4 sm:p-8 border border-sky-100">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: window.innerWidth < 640 
          ? "dayGridMonth,timeGridDay"   // 📱 fewer options on mobile
          : "dayGridMonth,timeGridWeek,timeGridDay"
      }}
      events={events}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      editable={true}
      selectable={true}
      eventDrop={handleEventDrop}
      height="auto"
      eventContent={(info) => (
        <div
          className="pinned-event text-white text-xs sm:text-sm p-1 rounded cursor-pointer"
          style={{ backgroundColor: info.event.backgroundColor }}
        >
          {info.event.title.length > 15
            ? info.event.title.slice(0, 15) + "..."
            : info.event.title}
        </div>
      )}
    />
  </div>
</div>
  );
};

export default Calendar;
