import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8990";

export default function HabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!newHabit) return;
    await axios.post(
      `${API}/habits`,
      { habit_name: newHabit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setNewHabit("");
    fetchHabits();
  };

  const toggleCompletion = async (habit) => {
    const today = new Date().toISOString().split("T")[0];
    let updatedDays = habit.completed_days || [];

    if (!updatedDays.includes(today)) {
      updatedDays.push(today);
    }

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, completed_days: updatedDays } : h
      )
    );

    try {
      await axios.put(
        `${API}/habits/${habit.id}`,
        { completed_days: updatedDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id) => {
    await axios.delete(`${API}/habits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHabits();
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
    <div className="min-h-screen bg-purple-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
        Habit Tracker
      </h1>

      {/* Add Habit */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Add new habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="border p-2 flex-1 rounded bg-white shadow-sm"
        />
        <button
          onClick={addHabit}
          disabled={!newHabit}
          className={`ml-2 px-4 rounded ${
            newHabit
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading habits...</p>
      ) : habits.length === 0 ? (
        <p className="text-center text-gray-500">
          No habits yet. Add one above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.completed_days);
            const totalDays = 30;
            const progressPercent = Math.min(
              ((habit.completed_days?.length || 0) / totalDays) * 100,
              100
            );

            return (
              <div
                key={habit.id}
                className="rounded-xl shadow-lg bg-white p-6 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-purple-700">
                    {habit.habit_name}
                  </h2>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 font-bold px-2 py-1 rounded border border-red-500 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-green-600 font-semibold mb-2">
                  🔥 Streak: {streak} days
                </p>

                <div className="w-full bg-gray-200 h-3 rounded mb-2">
                  <div
                    className="bg-purple-500 h-3 rounded"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {habit.completed_days?.length || 0} / {totalDays} days
                  completed
                </p>

                <button
                  onClick={() => toggleCompletion(habit)}
                  className={`mt-auto w-full py-2 rounded-lg font-medium ${
                    habit.completed_days?.includes(
                      new Date().toISOString().split("T")[0]
                    )
                      ? "bg-green-500 text-white"
                      : "bg-purple-200 hover:bg-purple-300 text-purple-800"
                  }`}
                >
                  {habit.completed_days?.includes(
                    new Date().toISOString().split("T")[0]
                  )
                    ? "Done Today"
                    : "Mark Today"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}