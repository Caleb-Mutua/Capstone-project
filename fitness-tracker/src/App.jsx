
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import WorkoutLogForm from './components/WorkoutLogForm'; 
import HistoryPage from './pages/HistoryPage'; 
import React, { useState, useEffect } from 'react';
import './index.css';

// --- A Simple Component for Your Homepage 

function HomePage() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Welcome to Your Fitness Journey!';
  const typingSpeed = 200; // milliseconds per character
  const repeatDelay = 2000; 
  useEffect(() => {
    let timeoutId;

    if (isTyping) {
      if (displayText.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        setIsTyping(false);
        // Start the repeat process after a delay
        timeoutId = setTimeout(() => {
          setDisplayText(''); // Clear the text
          setIsTyping(true); // Restart the typing effect
        }, repeatDelay);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isTyping, fullText, typingSpeed, repeatDelay]);


  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 rounded-lg shadow-xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-800">
        {displayText}
        {isTyping && <span className="cursor"></span>}
      </h1>
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