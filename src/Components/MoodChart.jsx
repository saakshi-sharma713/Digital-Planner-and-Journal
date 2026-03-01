import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const moodsList = [
  { emoji: "😄", value: 5 },
  { emoji: "😔", value: 4 },
  { emoji: "😐", value: 3 },
  { emoji: "😡", value: 2 },
  { emoji: "😰", value: 1 },
];

export default function MoodTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((m) =>
      new Date(m.created_at || m.date).toLocaleDateString()
    ),
    datasets: [
      {
        data: data.map((m) => m.mood_value),
        borderColor: "#FF69B4",
        backgroundColor: "#FFB6C1",
        tension: 0.4,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 24 },
          callback: function (val) {
            const mood = moodsList.find(
              (m) => m.value === Math.round(val)
            );
            return mood ? mood.emoji : "";
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}