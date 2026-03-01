// src/Components/Home/Header.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../ContextApi/DataContext";



const Header = () => {
  const [open, setOpen] = useState(false);
  const context = useContext(UserContext);
  const name = context?.name || "";
  const setName = context?.setName || (() => {});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setName("");
    navigate("/");
  };

  return (
    <header className="relative flex justify-between items-center px-6 py-4 shadow-md bg-white w-full">
      <h1 className="text-2xl font-bold text-gray-800">Productive App</h1>

      <div className="flex items-center gap-6">
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/home" className="hover:text-sky-400">Home</Link>
          <Link to="/journal" className="hover:text-sky-400">Journal</Link>
          <Link to="/todo" className="hover:text-sky-400">Todo</Link>
          <Link to="/calendar" className="hover:text-sky-400">Calendar</Link>
          <Link to="/mood" className="hover:text-sky-400">Mood</Link>
          <Link to="/habit" className="hover:text-sky-400">Habit</Link>
          <Link to="/dashboard" className="hover:text-sky-400">Dashboard</Link>
          <Link to="/goals" className="hover:text-sky-400">Goals</Link>
        </nav>

        {name ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-gray-700 font-semibold">
              Hi {name} 👋
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/"
            className="hidden md:block bg-sky-400 text-white px-4 py-2 rounded-md hover:bg-sky-500 transition"
          >
            Get Started
          </Link>
        )}

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-4 py-6 px-6 md:hidden">
          <Link to="/home">Home</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/todo">Todo</Link>
          <Link to="/goals">Goals</Link>
          <Link to="/habit">Habit</Link>
          <Link to="/dashboard">Dashboard</Link>

          {name && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;