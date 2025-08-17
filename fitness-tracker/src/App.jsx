import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LogWorkout from './pages/Logworkout'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">
            Fitness Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to your fitness tracking app!
          </p>
        </div>
        
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <a 
                href="/log" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log Your Workout
              </a>
            </div>
          } />
          <Route path="/log" element={<LogWorkout />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App