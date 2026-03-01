import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../Components/EventModal";
import axios from "axios";

const API = import.meta.env.VITE_URL; // Your backend URL, e.g., http://localhost:8990
const pastelColors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#c084fc", "#fb7185"];

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const token = localStorage.getItem("token"); // JWT token

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/calendar`, {
        params: { user_id: token }, // Replace with user ID if needed
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      setEvents(
        res.data.map((e) => ({
          ...e,
          start: new Date(e.start_datetime),
          backgroundColor: e.background_color,
          textColor: e.text_color,
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = async (info) => {
    const title = prompt("Enter Event Title");
    const time = prompt("Enter Time (HH:MM)");
    if (!title || !time) return;

    const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
     const date = new Date(`${info.dateStr} ${time}`);
  

    try {
   const response =   await axios.post(
        `${API}/calendar/add`,
        {
          title,
          start_datetime:date,
          background_color: randomColor,
          text_color: "#fff",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      fetchEvents();
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };
const handleEventDrop = (info) => {
  setEvents(events.map(e =>
    e.id === info.event.id ? { ...e, start: info.event.start } : e
  ));
};
  const handleEventClick = (info) => {
    setEditingEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      backgroundColor: info.event.backgroundColor,
      textColor: info.event.textColor,
    });
  };

  const saveEditedEvent = async (updatedEvent) => {
    try {
      await axios.put(
        `${API}/calendar/${updatedEvent.id}`,
        {
          title: updatedEvent.title,
          start_datetime: updatedEvent.start,
          background_color: updatedEvent.backgroundColor,
          text_color: updatedEvent.textColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const cancelEdit = async (action) => {
    if (action === "delete" && editingEvent) {
      try {
        await axios.delete(`${API}/calendar/${editingEvent.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
    setEditingEvent(null);
    fetchEvents();
  };

  if (editingEvent) {
    return <EventModal event={editingEvent} onSave={saveEditedEvent} onCancel={cancelEdit} />;
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

