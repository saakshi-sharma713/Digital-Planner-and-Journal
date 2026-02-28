import React, { useEffect, useState } from "react";
import axios from "axios";
import Doodle1 from "../Components/Doodles/Doodle1";
import Doodle3 from "../Components/Doodles/Doodle3";
import Doodle2 from "../Components/Doodles/Doodle2";

const API = "http://localhost:8990";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch goals
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add goal
  const addGoal = async () => {
    if (!newGoal) return;
    try {
      const payload = { goal_name: newGoal, category, target_date: targetDate };
      const res = await axios.post(`${API}/goals/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setGoals((prev) => [...prev, res.data]);
      setNewGoal("");
      setCategory("Select Category");
      setTargetDate("");
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  // Add progress +10%
  const addProgress = async (goal) => {
    const newProgress = Math.min((goal.progress || 0) + 10, 100);
    try {
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, progress: newProgress } : g))
      );
      await axios.put(`${API}/goals/${goal.id}`, { progress: newProgress });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    await axios.delete(`${API}/goals/${id}`);
    fetchGoals();
  };

  return (

    <div className="min-h-screen bg-pink-200 flex flex-col items-center py-10">
    
      <h1 className="text-5xl font-bold mb-6 ">
        🎯 Goals List
      </h1>

      {/* Input Bar */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Goal name"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="border p-2 flex-1 rounded focus:ring-2 focus:ring-mint-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-mint-400"
          >
            <option>Select Category</option>
            <option>Personal</option>
            <option>Academic</option>
            <option>Career</option>
          </select>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-mint-400"
          />
          <button
            onClick={addGoal}
            className="bg-mint-500 hover:bg-mint-600 text-white px-6 py-2 rounded transition"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* Goals as Cards */}
      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading goals...</p>
        ) : goals.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-6">
            🚀 No goals yet — start by adding one above!
          </p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {goal.goal_name}{" "}
                  <span className="text-sm text-gray-500">({goal.category})</span>
                </h2>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  🗑 Delete
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-3 rounded-full mb-2 overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{goal.progress}% completed</p>

              {/* Progress Button */}
              <button
                onClick={() => addProgress(goal)}
                disabled={goal.progress === 100}
                className={`mt-3 px-4 py-2 rounded-lg transition ${
                  goal.progress === 100
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {goal.progress === 100 ? "✅ Completed" : " Add Progress"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}