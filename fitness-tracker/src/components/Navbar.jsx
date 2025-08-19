// src/components/Navbar.jsx

import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-blue-800">
          FitTrack
        </NavLink>
        <div className="space-x-6">
          <NavLink
            to="/log"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Log Workout
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            History & Progress
          </NavLink>
        </div>
      </nav>
    </header>
  );
}