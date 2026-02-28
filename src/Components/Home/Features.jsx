import React from 'react'
import { Link } from "react-router-dom";
const Features = () => {
  return (
    <div className='font-handwriting'>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 py-12">
        <div className="bg-sky-50 text-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">📝 Write Freely</h3>
          <p>Rich text editor with colors, images, and videos.</p>
        </div>
        <div className="bg-yellow-50 text-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">🧸 Bright Themes</h3>
          <p>Sky‑blue and yellow palettes with doodle accents.</p>
        </div>
        <div className="bg-sky-50 text-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">📁 Organized Entries</h3>
          <p>Save, search, and revisit your thoughts easily.</p>
        </div>
      </div>
    </div>
  )
}

export default Features
