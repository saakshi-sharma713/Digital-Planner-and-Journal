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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const moodsList = [
  { emoji: "😄", label: "Happy", color: "#FFD700", value: 5 },
  { emoji: "😔", label: "Sad", color: "#1E90FF", value: 4 },
  { emoji: "😐", label: "Neutral", color: "#A9A9A9", value: 3 },
  { emoji: "😡", label: "Angry", color: "#FF4500", value: 2 },
  { emoji: "😰", label: "Anxious", color: "#8A2BE2", value: 1 },
];

export default function MoodTrendOnly() {
  const [moods, setMoods] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await axios.get("http://localhost:8990/mood", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMoods(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: moods.map((m) =>
      new Date(m.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Mood (Higher = Happier)",
        data: moods.map((m) => m.mood_value),
        borderColor: "#FF69B4",
        backgroundColor: "#FFB6C1",
        pointBackgroundColor: moods.map((m) => {
          const moodInfo = moodsList.find(
            (ml) => ml.value === m.mood_value
          );
          return moodInfo ? moodInfo.color : "#ccc";
        }),
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Mood Over Days 📅",
        font: { size: 20 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const mood = moods[context.dataIndex];
            return `${mood.mood_emoji} ${mood.mood_label}${
              mood.note ? ` - ${mood.note}` : ""
            }`;
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
            const mood = moodsList.find(
              (m) => m.value === Math.round(val)
            );
            return mood ? mood.emoji : "";
          },
          font: { size: 20 },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}