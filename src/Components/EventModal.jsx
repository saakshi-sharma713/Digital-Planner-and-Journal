import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API = import.meta.env.VITE_URL;
const token = localStorage.getItem("token");

const EditEventPage = ({ event, onCancel }) => {
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderOption, setReminderOption] = useState("");
  const [reminderSet, setReminderSet] = useState(!!event?.reminder_time);

  // ✅ Format Date in IST
  const formatISTDate = (utc) =>
    new Date(utc).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

  // ✅ Format Time in IST
  const formatISTTime = (utc) =>
    new Date(utc).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // ✅ Countdown Logic (UTC safe)
 const deletedRef = useRef(false);

useEffect(() => {
  if (!event?.start) return;

  const startTime = new Date(event.start);

  const updateTimer = async () => {
    const now = new Date();
    const diff = startTime - now;

    if (diff <= 0 && !deletedRef.current) {
      deletedRef.current = true;

      try {
        await axios.delete(
          `http://localhost:8990/calendar/${event.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Event auto deleted ⏳");
        onCancel("close");
      } catch (err) {
        console.error(err);
        toast.error("Auto delete failed");
      }

      return;
    }

    if (diff > 0) {
      const totalMinutes = Math.floor(diff / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setMinutesLeft(`${hours}h ${minutes}m`);
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 60000);

  return () => clearInterval(interval);
}, [event]);
  // ✅ Save Reminder
  const handleSaveReminder = async () => {
    if (!reminderOption) return toast.error("Select a reminder option");

    try {
      await axios.put(
        `http://localhost:8990/calendar/add-reminder/${event.id}`,
        { reminder_option: reminderOption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Reminder set 🔔");
      setReminderSet(true);
      setShowReminder(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set reminder");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl p-6"
        style={{ backgroundColor: event?.backgroundColor }}
      >
        <Toaster />

        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          {event?.title}
        </h2>

        {/* ✅ Scheduled Time */}
        <p className="text-sm text-gray-700 mb-2">
          📅 Scheduled on :{formatISTDate(event.start)}
        </p>

        <p className="text-sm text-gray-700 mb-4">
          ⏰ {formatISTTime(event.start)}
        </p>

        {/* ✅ Countdown */}
        {minutesLeft && (
          <p className="text-sm font-medium text-gray-800 mb-4">
            {minutesLeft === "Started"
              ? "⏰ Event started"
              : `⏱ Event in ${minutesLeft}`}
          </p>
        )}

        {/* ✅ Reminder Section */}
        {reminderSet ? (
          <p className="text-sm font-medium text-green-700 mb-3">
            🔔 Reminder already set
          </p>
        ) : (
          <>
            <button
              onClick={() => setShowReminder(!showReminder)}
              className="text-sm font-medium mb-3 hover:text-blue-600 transition"
            >
              🔔 Add Reminder
            </button>

            {showReminder && (
              <>
                <select
                  value={reminderOption}
                  onChange={(e) => setReminderOption(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                >
                  <option value="">Select Reminder</option>
                  <option value="5min">5 Minutes Before</option>
                  <option value="30min">30 Minutes Before</option>
                  <option value="1hour">1 Hour Before</option>
                  <option value="1day">1 Day Before</option>
                </select>

                <button
                  onClick={handleSaveReminder}
                  disabled={!reminderOption}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50 mb-3"
                >
                  Save Reminder
                </button>
              </>
            )}
          </>
        )}

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
};

export default EditEventPage;