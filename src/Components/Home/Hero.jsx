import React from 'react'
import { Link } from "react-router-dom";
import Doodle1 from '../Doodles/Doodle1';
import Doodle2 from '../Doodles/Doodle2';
import Doodle3 from '../Doodles/Doodle3';
const Hero = () => {
  return (
    <div>
      
      
      
       <div className="flex bg-sky-50  flex-col items-center justify-center gap-2 text-center py-20 font-handwriting mt-10">
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
          <button>
          <Link
            to="/dashboard"
            className="bg-yellow-400 text-white px-6 py-3 rounded-md hover:bg-yellow-500 transition"
          >
            View Progress
          </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
