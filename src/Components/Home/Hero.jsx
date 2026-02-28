import React from 'react'
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div>
       <div className="flex flex-col items-center justify-center gap-2 text-center py-20 font-handwriting mt-10">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Your Journal, Your Space
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Write, reflect, and grow every day.
        </p>
        <div className="flex gap-4">
          <Link
            to="/journal"
            className="bg-sky-400 text-white px-6 py-3 rounded-md hover:bg-sky-500 transition"
          >
            Start Journaling
          </Link>
          <Link
            to="/journals"
            className="bg-yellow-400 text-white px-6 py-3 rounded-md hover:bg-yellow-500 transition"
          >
            View My Journals
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
