import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name"));
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setName(""); // Update state immediately
    navigate("/"); // Redirect to landing page or login
  }

  return (
   <header className="relative flex justify-between items-center px-6 py-4 shadow-md bg-white w-full">
  {/* Logo on the left */}
  <h1 className="text-2xl font-bold text-gray-800">My Journal App</h1>

  {/* Right side: nav + CTA */}
  <div className="flex items-center gap-6">
    {/* Desktop Nav */}
    <nav className="hidden md:flex items-center gap-6 text-gray-700">
      <Link to="/home" className="hover:text-sky-400">Home</Link>
      <Link to="/journal" className="hover:text-sky-400">Journal</Link>
      <Link to="/todo" className="hover:text-sky-400">Todo</Link>
      <Link to="/calendar" className="hover:text-sky-400">Calendar</Link>
      <Link to="/mood" className="hover:text-sky-400">Mood</Link>
      <Link to="/dashboard" className="hover:text-sky-400">Dashboard</Link>
      <Link to="/goals" className="hover:text-sky-400">Goals</Link>
     
    </nav>

    {/* CTA Button (Desktop) */}
    {name ? (
      <div className="flex items-center gap-4">
        <span className="hidden md:block text-gray-700 font-semibold">
          Hi {name}
        </span>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={handleLogout}
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

    {/* Hamburger (Mobile) */}
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
      <Link to="/home" className="hover:text-sky-400 w-full">Home</Link>
      <Link to="/journal" className="hover:text-sky-400 w-full">Journal</Link>
      <Link to="/todo" className="hover:text-sky-400 w-full">Todo</Link>
      <Link to="/contact" className="hover:text-sky-400 w-full">Contact</Link>
      <Link
        to="/journal"
        className="bg-sky-400 text-white px-4 py-2 rounded-md hover:bg-sky-500 transition text-center w-full"
      >
        Start Journaling
      </Link>
      {name && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
          onClick={handleLogout}
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