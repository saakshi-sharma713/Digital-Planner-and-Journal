import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moodsList = [
  { emoji: "😄", label: "Happy", color: "#FFD700", value: 5 },
  { emoji: "😔", label: "Sad", color: "#1E90FF", value: 4 },
  { emoji: "😐", label: "Neutral", color: "#A9A9A9", value: 3 },
  { emoji: "😡", label: "Angry", color: "#FF4500", value: 2 },
  { emoji: "😰", label: "Anxious", color: "#8A2BE2", value: 1 },
];

export default function MoodTrackerDailyChart() {
  const [moods, setMoods] = useState([]);
  const [note, setNote] = useState("");
  const token = localStorage.getItem("token");

  const fetchMoods = async () => {
    const response = await axios.get("http://localhost:8990/mood", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setMoods(response.data);
  };

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
      const response = await axios.post("http://localhost:8990/mood/add", moodData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setMoods((prev) => [...prev, response.data]);
      setNote("");
      fetchMoods();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    await axios.delete(`http://localhost:8990/mood/${id}`);
    fetchMoods();
  };

  // Chart Data
  const chartData = {
    labels: moods.map((m) => new Date(m.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Mood (Higher = Happier)",
        data: moods.map((m) => m.mood_value),
        borderColor: "#FF69B4",
        backgroundColor: "#FFB6C1",
        pointBackgroundColor: moods.map((m) => m.color),
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Mood Over Days 📅", font: { size: 20 } },
      tooltip: {
        callbacks: {
          label: function (context) {
            const mood = moods[context.dataIndex];
            return `${mood.mood_emoji} ${mood.mood_label}${mood.note ? ` - ${mood.note}` : ""}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function (val) {
            const mood = moodsList.find((m) => m.value === Math.round(val));
            return mood ? mood.emoji : "";
          },
          font: { size: 20 },
        },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div className="p-8 bg-gradient-to-br from-mint-100 to-peach-100 min-h-screen">
      <h1 className="mb-10 text-4xl font-bold text-indigo-700 text-center">🎉 Daily Mood Tracker 🎉</h1>

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

      {/* Mood History & Chart */}
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
                  {m.mood_emoji} {m.mood_label} {m.note && `- ${m.note}`}{" "}
                  <span className="text-xs text-gray-600">({m.date})</span>
                </div>
                <button
                  onClick={() => deleteMood(m.id)}
                  className="ml-2 text-white px-2 py-1 rounded bg-red-500 hover:bg-red-600"
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
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}