import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API = import.meta.env.VITE_URL;
const token = localStorage.getItem("token");

const EditEventPage = ({ event, onCancel, time }) => {
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderOption, setReminderOption] = useState("");
  const [reminderSet, setReminderSet] = useState(false);

  const deletedRef = useRef(false);

  // Format Date IST
  const formatISTDate = (utc) =>
    new Date(utc).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

  // Format Time IST
  const formatISTTime = (utc) =>
    new Date(utc).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  useEffect(() => {
  if (!event?.start_datetime) return;

  setReminderSet(!!event?.reminder_time);

  const startTime = new Date(event.start_datetime).getTime();

  const updateTimer = async () => {
    const now = Date.now(); // ✅ must be inside timer
    const diff = startTime - now;

    if (diff <= 0 && !deletedRef.current) {
      deletedRef.current = true;

      try {
        await axios.delete(`${API}/calendar/${event.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Past event auto deleted ⏳");
        onCancel("close");
      } catch (err) {
        console.log(err);
        toast.error("Auto delete failed");
      }

      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    let timeString = "";

    if (days > 0) {
      timeString = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    } else if (hours > 0) {
      timeString = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      timeString = `${minutes}m`;
    }

    setMinutesLeft(timeString);
  };

  updateTimer();

  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);
}, [event]);

  const handleSaveReminder = async () => {
    if (!reminderOption) return toast.error("Select a reminder option");

    try {
      await axios.put(
        `${API}/calendar/add-reminder/${event.id}`,
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

        <h2 className="text-5xl font-bold mb-4 text-gray-800">
          {event?.title}
        </h2>

        <p className="text-sm text-gray-700 mb-2">
          📅 Scheduled on : {formatISTDate(event.start_datetime)}
        </p>

        <p className="text-sm text-gray-700 mb-3">
          ⏰ At {formatISTTime(event.start_datetime)}
        </p>

      

        {reminderSet ? (
          <p className="text-sm font-medium text-green-700 mb-3">
            🔔 Reminder already set
          </p>
        ) : (
          <>
            <button
              onClick={() => setShowReminder(!showReminder)}
              className="text-sm font-medium mb-3 text-gray-700"
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
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>

          <button
            onClick={() => onCancel("close")}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;