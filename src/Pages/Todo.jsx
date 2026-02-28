


// TodoPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoCard from "../Components/TodoCard";

const API = "http://localhost:8990/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
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

  const fetchTodos = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}`, authHeader);
      setTodos(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      setLoading(true);
      await axios.post(
        `${API}/add`,
        {
          title,
          priority: filters.priority,
          type: filters.type,
          due_date: new Date().toISOString(),
        },
        authHeader
      );
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      setLoading(true);
      await axios.put(`${API}/update/${todo.id}`, {
        title: todo.title,
        status: !todo.status,
      });
      fetchTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/delete/${id}`, authHeader);
      fetchTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filters,
      });
      setTodos(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // helper to style todos by priority + status
  const getTodoClasses = (todo) => {
    if (todo.status) {
      return "bg-green-100 border-green-300";
    }
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

  // helper for badge style
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
      {/* HEADER */}
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
        My Todos
      </h2>

      {/* INPUT + FILTERS + BUTTONS */}
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

      {/* TASKS */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Personal Tasks */}
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

        {/* Work Tasks */}
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