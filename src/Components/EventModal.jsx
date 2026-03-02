import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import image from "../assets/image.png";

const API = import.meta.env.VITE_URL;
const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("email");

const EditEventPage = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [reminderSet, setReminderSet] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    if (!event?.start) return;

    const startTime = new Date(event.start);

    const updateTimer = () => {
      const now = new Date();
      const diff = startTime - now;

      if (diff <= 0) {
        setMinutesLeft("Started");
        return;
      }

      const totalMinutes = Math.floor(diff / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setMinutesLeft(`${hours}h ${minutes}m`);
    };

    updateTimer(); // run immediately
    const interval = setInterval(updateTimer, 60000); // update every 1 min

    return () => clearInterval(interval);
  }, [event]);
  return (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div
      className="w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl p-6"
      style={{ backgroundColor: event?.backgroundColor }}
    >
      {/* Title */}
      <h2 className="text-5xl font-bold mb-4 text-gray-800">
        {event?.title}
      </h2>

      {/* Scheduled Time */}
      <p className="text-sm text-gray-700 mb-2">
        📅 {new Date(event.start).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        ⏰ {new Date(event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Time Left */}
      {minutesLeft && (
        <p className="text-sm font-medium text-gray-800 mb-6">
          {minutesLeft === "Started"
            ? "⏰ Event started"
            : `⏱ Event in ${minutesLeft}`}
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onCancel("delete")}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>

        <button
          onClick={() => onCancel("close")}
          className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
}
export default EditEventPage;