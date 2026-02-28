import React from 'react'
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
       {/* Footer */}
      <footer className="text-center py-6 bg-sky-400 text-white">
        © 2026 My Journal App · <Link to="/about">About</Link> · <Link to="/contact">Contact</Link>
      </footer>
    </div>
  )
}

export default Footer
