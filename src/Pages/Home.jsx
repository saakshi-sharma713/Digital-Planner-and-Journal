import React, { useContext } from "react";
import Calendar from "./Calendar";
import myImage from "../Images/image.png";
import { Link } from "react-router-dom";
import Header from "../Components/Home/Header";
export default function LandingPage() {
  const name =localStorage.getItem("name")
  console.log(name)
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ================= HEADER ================= */}
  
      {/* ================= HERO ================= */}
      <section className="text-center py-24 bg-gradient-to-r from-sky-100 to-blue-100">
        <h2 className="text-5xl font-bold text-gray-800">
          Organize Your Life ✨
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Track your tasks, monitor your mood, and achieve your goals
          all in one place.
        </p>

        <button className="mt-8 bg-sky-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-sky-600">
          <Link to="/dashboard">
          
          Start Tracking
          </Link>
        </button>
      </section>


      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          App Features 🚀
        </h2>

        <div className="grid md:grid-cols-3 gap-8 px-10">

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">📝 Todo Manager</h3>
            <p>Organize work & personal tasks efficiently.</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">😊 Mood Tracker</h3>
            <p>Track daily mood trends and analyze patterns.</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">🎯 Goal Tracking</h3>
            <p>Set goals and monitor progress easily.</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">🎯 Habit Tracker</h3>
            <p>Set goals and monitor progress easily.</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">🎯 Journal</h3>
            <p>Set goals and monitor progress easily.</p>
          </div>


           <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-4">🎯 Dashboard</h3>
            <p>Set goals and monitor progress easily.</p>
          </div>
        </div>
      </section>


      {/* ================= CALENDAR PREVIEW ================= */}
     

<section id="calendar" className="py-20 bg-sky-50 text-center flex mb-20">
        <h2 className="text-5xl font-bold mb-10">
         Smart Calendar
        </h2>

        <div className="mx-auto w-[80%] h-64 bg-white shadow-lg rounded-xl flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            
            <img src={myImage} height="200"/>
          </p>
        </div>
      </section>
      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-auto">
        <p>© 2026 Productivity App</p>
        <p className="text-sm mt-2 text-gray-400">
          Built with ❤️ using React & Node
        </p>
      </footer>

    </div>
  );
}