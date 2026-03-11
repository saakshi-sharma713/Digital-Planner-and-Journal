import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_URL;

export default function Habit() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch habits
  const fetchHabits = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!newHabit.trim()) return;
    try {
      await axios.post(
        `${API}/habits`,
        { habit_name: newHabit.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewHabit("");
      fetchHabits();
      toast.success("✨ New habit added!");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Could not add habit");
    }
  };

  const toggleCompletion = async (habit) => {
    if (!token) return;
    const today = new Date().toISOString().split("T")[0];
    const updatedDays = habit.completed_days ? [...habit.completed_days] : [];
    if (updatedDays.includes(today)) return;
    updatedDays.push(today);

    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, completed_days: updatedDays } : h))
    );

    try {
      console.log(updatedDays)
      await axios.put(
        `${API}/habits/${habit.id}`,
        { completed_days: updatedDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🌟 Great job! Keep shining!");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Could not update habit");
    }
  };

  const deleteHabit = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API}/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
      toast.success("🗑 Habit deleted");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Could not delete habit");
    }
  };

  const calculateStreak = (completed_days) => {
    if (!completed_days || completed_days.length === 0) return 0;
    let streak = 0;
    let day = new Date();
    while (completed_days.includes(day.toISOString().split("T")[0])) {
      streak++;
      day.setDate(day.getDate() - 1);
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-purple-100 py-10 px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-800 mb-10">
        🌈 Habit Tracker
      </h1>

      {/* Add Habit Bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <input
          type="text"
          placeholder="Add new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={addHabit}
          disabled={!newHabit.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            newHabit.trim()
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          ➕ Add
        </button>
      </div>

      {/* Habits Grid */}
      {loading ? (
        <Loader />
      ) : habits.length === 0 ? (
        <p className="text-center text-gray-500 italic mt-10">
          🚀 No habits yet — start by adding one above!
        </p>
      ) : (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.completed_days);
            const totalDays = 30;
            const progressPercent = Math.min(
              ((habit.completed_days?.length || 0) / totalDays) * 100,
              100
            );
            const today = new Date().toISOString().split("T")[0];
            const doneToday = habit.completed_days?.includes(today);

            return (
              <div
                key={habit.id}
                className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition hover:shadow-2xl hover:scale-[1.02] ${
                  doneToday ? "bg-mint-50  border-mint-300" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-2xl text-purple-700">
                    {habit.habit_name}
                  </h2>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100"
                  >
                    ❌
                  </button>
                </div>

                <span className="inline-block bg-peach-200 text-peach-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  🔥 Streak: {streak} days
                </span>

                <div className="w-full bg-gray-200 h-3 rounded mb-2 overflow-hidden">
                  <div
                    className="bg-purple-400 h-3 rounded transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {habit.completed_days?.length || 0} / {totalDays} days completed
                </p>

                <button
                  onClick={() => toggleCompletion(habit)}
                  disabled={doneToday}
                  className={`mt-auto w-full py-2 rounded-lg font-medium transition ${
                    doneToday
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  {doneToday ? "🎉 Done Today — Amazing!" : "Mark Today 💪"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}