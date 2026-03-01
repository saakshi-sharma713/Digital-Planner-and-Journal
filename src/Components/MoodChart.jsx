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
  if (!data || data.length === 0) return <p className="text-center">No mood data yet.</p>;

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
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ allows dynamic height/width
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const moodEntry = data[index];
            const note = moodEntry.note ? `  "${moodEntry.note}"` : "";
            const mood = moodsList.find((m) => m.value === moodEntry.mood_value);
            return `${mood ? mood.emoji : ""}  ${note}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 30 },
          callback: function (val) {
            const mood = moodsList.find((m) => m.value === Math.round(val));
            return mood ? mood.emoji : "";
          },
        },
      },
      x: {
        ticks: {
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="w-full h-96 md:h-[500px]">
      <Line data={chartData} options={options} />
    </div>
  );
}