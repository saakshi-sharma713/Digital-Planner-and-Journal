import React, { useState, useEffect } from "react";
import image from "../assets/image.png";

const EditEventPage = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setTime(event.time);
    }
  }, [event]);

  if (!event) return null;

  const handleSave = () => {
    if (!title || !time) return alert("Title and time required");
    onSave({ ...event, title, time });
  };

  // Format date as "Mar 12, 2026 | 2:30 PM"
  const formattedDate = event.start
    ? `${event.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} | ${event.start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`
    : "";

  return (
    <div className="min-h-screen flex-col items-center justify-center bg-gray-100 p-10">
      <div className="flex flex-col justify-center items-center p-10">
        <img
          src={image}
          width="80"
          className="absolute z-1 left-155 top-25 drop-shadow-md rotate-[-10deg]"
        />

        <div
          className="relative p-10 rounded-2xl shadow-2xl w-[500px] rotate-[-2deg]"
          style={{ backgroundColor: event.backgroundColor, fontFamily: "Caveat, cursive" }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Patrick Hand, cursive" }}>
            Edit Event
          </h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full p-4 mb-6 rounded text-xl"
            style={{ fontFamily: "Patrick Hand, cursive", backgroundColor: "white" }}
          />

          <h2>Scheduled on:</h2>
          <p className="mb-6">{formattedDate}</p>

          <div className="flex justify-end gap-4">
           
            <button
              onClick={() => onCancel("delete")}
              className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 text-lg"
              style={{ fontFamily: "Patrick Hand, cursive" }}
            >
              Delete
            </button>
            <button
              onClick={() => onCancel("close")}
              className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 text-lg"
              style={{ fontFamily: "Patrick Hand, cursive" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;