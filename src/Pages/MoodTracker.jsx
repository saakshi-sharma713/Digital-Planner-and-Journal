import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import MoodTrendChart from "../Components/MoodChart";
import Loader from "../Components/Loader";
import { UserContext } from "../ContextApi/DataContext";

const moodsList = [
  { emoji: "😄", label: "Happy", color: "#34D399", value: 5 },
  { emoji: "😔", label: "Sad", color: "#60A5FA", value: 4 },
  { emoji: "😐", label: "Neutral", color: "#A78BFA", value: 3 },
  { emoji: "😡", label: "Angry", color: "#F87171", value: 2 },
  { emoji: "😰", label: "Anxious", color: "#FBBF24", value: 1 },
];

export default function MoodTrackerDailyChart() {
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_URL;

  const { moods, fetchMoods, loadingMoods } = useContext(UserContext);

  useEffect(() => {
    fetchMoods();
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
      fetchMoods();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${API}/mood/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMoods();
    } catch (err) {
      console.error(err);
    }
  };

  // Optimized calculations
  const averageMood = useMemo(() => {
    return moods.length > 0
      ? (
          moods.reduce((sum, m) => sum + m.mood_value, 0) /
          moods.length
        ).toFixed(1)
      : 0;
  }, [moods]);

  const mostFrequentMood = useMemo(() => {
    if (moods.length === 0) return "None";

    const count = {};
    moods.forEach((m) => {
      count[m.mood_label] = (count[m.mood_label] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }, [moods]);

  return (
    <div className="min-h-screen bg-mint-100 p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">
        🎯 Mood Tracker Dashboard
      </h1>

      {loadingMoods ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold">
                📊 Average Mood Score
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {averageMood}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold">
                ⭐ Most Frequent Mood
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {mostFrequentMood}
              </p>
            </div>
          </div>

          {/* Mood Buttons */}
          <div className="flex justify-center flex-wrap gap-6 mb-10">
            {moodsList.map((m, i) => (
              <button
                key={i}
                onClick={() => addMood(m)}
                className="text-3xl md:text-4xl p-5 md:p-6 rounded-full shadow-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: m.color, color: "#fff" }}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className="flex justify-center mb-10">
            <input
              type="text"
              placeholder="💭 Add a quick note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2"
            />
          </div>

          {/* Grid Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mood Log */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                📖 Mood Log
              </h2>

              <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                {moods.map((m) => (
                  <li
                    key={m.id}
                    className="flex justify-between items-center p-4 rounded-lg shadow-sm border-l-4"
                  >
                    <div>
                      <span className="text-2xl mr-2">
                        {m.mood_emoji}
                      </span>
                      <span className="font-semibold">
                        {m.mood_label}
                      </span>
                      {m.note && (
                        <span className="italic text-gray-600">
                          {" "}
                          — {m.note}
                        </span>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {m.date}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteMood(m.id)}
                      className="text-red-500 text-xl"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                📈 Mood Trend
              </h2>
              <MoodTrendChart data={moods} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}