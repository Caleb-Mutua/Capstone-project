
// src/components/Navbar.jsx (Upgraded and Responsive)

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  // State to manage whether the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the menu, useful for when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <nav className= "bg-gray-900 container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <NavLink to="/" className="text-2xl font-bold text-blue-800" onClick={closeMenu}>
          FitTrack
        </NavLink>

        {/* --- Hamburger Menu Button (Mobile) --- */}
        {/* This button is hidden on medium screens and up (md:hidden) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              // X icon (close)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon (open)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* --- Desktop Menu Links --- */}
        {/* These links are hidden by default and shown on medium screens and up (hidden md:flex) */}
        <div className="hidden md:flex space-x-8 items-center bg-gray-900">


          <NavLink
            to="/log"
            className={({ isActive }) =>
              isActive

                ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-600 transition-colors"

            }
          >
            Log Workout
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive

                ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-600 transition-colors"

            }
          >
            History & Progress
          </NavLink>
          
        </div>
      </nav>


      {/* --- Mobile Menu (Dropdown) --- */}
      {/* This menu appears below the navbar when isOpen is true */}
      {/* The `transition-all` and `duration-300` classes create a smooth slide-down effect */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out bg-gray-900 shadow-lg`}>
        <div className="flex flex-col items-center space-y-4 py-4">
          <NavLink
            to="/log"
            className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}
            onClick={closeMenu}
          >
            Log Workout
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}
            onClick={closeMenu}
          >
            History & Progress
          </NavLink>
        </div>
      </div>

    </header>
  );
}