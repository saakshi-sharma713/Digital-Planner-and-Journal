import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoCard from "../Components/TodoCard";
import Loader from "../Components/Loader";

const API = import.meta.env.VITE_URL;

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loader only on first load
  const [filters, setFilters] = useState({
    priority: "",
    type: "",
    status: "",
  });

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Fetch todos (initial page load or reset)
  const fetchTodos = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/todo`, authHeader);
      setTodos(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false); // ✅ only stop loader after first fetch
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(
        `${API}/todo/add`,
        {
          title,
          priority: filters.priority,
          type: filters.type,
          due_date: new Date().toISOString(),
        },
        authHeader
      );
      setTitle("");
      fetchTodos(); // ✅ update todos without showing loader
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await axios.put(`${API}/todo/update/${todo.id}`, {
        title: todo.title,
        status: !todo.status,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, status: !t.status } : t))
      ); // ✅ instant UI update
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todo/delete/${id}`, authHeader);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const searchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todo/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filters,
      });
      setTodos(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const getTodoClasses = (todo) => {
    if (todo.status) return "bg-green-100 border-green-300";
    switch (todo.priority) {
      case "high":
        return "bg-red-100 border-red-300";
      case "medium":
        return "bg-yellow-100 border-yellow-300";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-[#AAD0F1] p-6 md:p-12 font-sans">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
        My Todos
      </h2>

      {/* ✅ Loader only on first load */}
      {loading && (
        <div className="flex justify-center my-6">
          <Loader />
        </div>
      )}

      <form
        onSubmit={addTodo}
        className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-blue-200 outline-none bg-white w-full"
        />

        <select
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="w-full md:w-auto p-3 rounded-lg border border-blue-200 bg-white cursor-pointer"
        >
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="w-full md:w-auto p-3 rounded-lg border border-blue-200 bg-white cursor-pointer"
        >
          <option value="">Type</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add
        </button>

        <button
          type="button"
          onClick={searchTodos}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>

        <button
          type="button"
          onClick={fetchTodos}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          All
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-blue-700 font-bold mb-4">Personal Tasks</h3>
          {todos
            .filter((todo) => todo.type === "personal")
            .map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                getTodoClasses={getTodoClasses}
                getPriorityBadge={getPriorityBadge}
              />
            ))}
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-blue-800 font-bold mb-4">Work Tasks</h3>
          {todos
            .filter((todo) => todo.type === "work")
            .map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                getTodoClasses={getTodoClasses}
                getPriorityBadge={getPriorityBadge}
              />
            ))}
        </div>
      </div>
    </div>
  );
}