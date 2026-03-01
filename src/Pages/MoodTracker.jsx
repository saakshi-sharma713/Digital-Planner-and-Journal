import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MoodTrendChart from "../Components/MoodChart";
import Loader from "../Components/Loader";
import { UserContext } from "../ContextApi/DataContext";

const moodsList = [
  { emoji: "😄", label: "Happy", color: "#FFD700", value: 5 },
  { emoji: "😔", label: "Sad", color: "#1E90FF", value: 4 },
  { emoji: "😐", label: "Neutral", color: "#A9A9A9", value: 3 },
  { emoji: "😡", label: "Angry", color: "#FF4500", value: 2 },
  { emoji: "😰", label: "Anxious", color: "#8A2BE2", value: 1 },
];

export default function MoodTrackerDailyChart() {
  const { moods, setMoods } = useContext(UserContext);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true); // ✅ start as true only for page load

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_URL;

  const fetchMoods = async () => {
    try {
      const response = await axios.get(`${API}/mood`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMoods(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ stop loader only after initial fetch
    }
  };

  useEffect(() => {
    fetchMoods();
    // eslint-disable-next-line
  }, []);

  const addMood = async (mood) => {
    const today = new Date().toLocaleDateString();
    const moodData = {
      mood_label: mood.label,
      mood_emoji: mood.emoji,
      mood_value: mood.value,
      note: note || "",
      date: today,
    };

    try {
      await axios.post(`${API}/mood/add`, moodData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNote("");
      fetchMoods(); // ✅ fetch again but without changing the loader
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${API}/mood/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMoods(); // ✅ fetch again without showing loader
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-mint-100 to-peach-100 min-h-screen">
      <h1 className="mb-10 text-4xl font-bold text-indigo-700 text-center">
        🎉 Daily Mood Tracker 🎉
      </h1>

      {/* ✅ Loader only on initial page load */}
      {loading ? (
        <div className="flex justify-center mb-6">
          <Loader />
        </div>
      ) : (
        <>
          {/* Mood Buttons */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {moodsList.map((m, i) => (
              <button
                key={i}
                onClick={() => addMood(m)}
                className="text-3xl p-4 rounded-full shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: m.color, color: "#fff" }}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Add your emotion..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* History + Chart */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* History */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">📖 Mood History</h2>
              <ul className="list-none p-0">
                {moods.map((m, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center p-3 mb-2 rounded-lg shadow-sm"
                    style={{ backgroundColor: m.color + "33" }}
                  >
                    <div className="text-lg">
                      {m.mood_emoji} {m.mood_label} {m.note && `- ${m.note}`}
                      
                    </div>
                    <button
                      onClick={() => deleteMood(m.id)}
                      className="ml-2 text-white px-2 py-1 rounded"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chart */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">📊 Mood Trend</h2>
              <MoodTrendChart data={moods} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}