import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import WorkoutLogForm from './components/WorkoutLogForm'; 
import HistoryPage from './pages/HistoryPage'; 

import './index.css';

// --- A Simple Component for Your Homepage ---
function HomePage() {
  return (
    <div className="bg-gray-900 h-screen flex flex-col items-center justify-center text-center px-6 rounded-lg shadow-xl ">
      <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome to Your Fitness Journey!</h1>
      <p className="text-gray-600 text-base sm:text-lg mb-8">
        Track your workouts, see your progress, and reach your goals.
      </p>
      <Link
        to="/log"
        className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
      >
        Log a New Workout

      </Link>
    </div>
  );
}


// A "wrapper" component to provide navigation logic to your form

function LogWorkoutPage() {
  const navigate = useNavigate();

  const handleSaveWorkout = (workout) => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const updatedWorkouts = [workout, ...savedWorkouts];
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    
    alert('Workout saved successfully!');
    navigate('/history'); // Redirect to history page after saving
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to homepage on cancel
  };



  return <WorkoutLogForm onSaveWorkout={handleSaveWorkout} onCancel={handleCancel} />;
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">

        {/* 1. Navbar is placed here, OUTSIDE <Routes>, so it appears on every page */}

        <Navbar />

        {/* 2. Main content area where pages will be swapped */}
        <main className="container mx-auto p-4 md:p-6">
          <Routes>

            {/* 3. Define the route for each page */}
            
            <Route path="/" element={<HomePage />} />
            
            <Route path="/log" element={<LogWorkoutPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;