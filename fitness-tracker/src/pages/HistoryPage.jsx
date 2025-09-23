// src/pages/HistoryPage.jsx

import { useState, useEffect } from 'react';
import WorkoutHistory from '../components/WorkoutHistory';
import ProgressChart from '../components/ProgressChart';
import StatCard from '../components/StatCard'; // Make sure this component is created and imported


export default function HistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');

  
  // --- NEW: State for the metric dropdown ---
  const [selectedMetric, setSelectedMetric] = useState('maxWeight');


  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
  }, []);

    
  // --- NEW: High-Level Statistic Calculations ---
  const totalWorkouts = workouts.length;

  const overallVolume = workouts.reduce((totalVol, workout) => {
    const workoutVolume = workout.exercises.reduce((exVol, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setVol, set) => {
        return setVol + (Number(set.reps) || 0) * (Number(set.weight) || 0);
      }, 0);
      return exVol + exerciseVolume;
    }, 0);
    return totalVol + workoutVolume;
  }, 0);

  const totalSets = workouts.reduce((count, workout) => {
    return count + workout.exercises.reduce((exCount, ex) => exCount + ex.sets.length, 0);
  }, 0);
  
  const totalReps = workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((exTotal, ex) => {
          return exTotal + ex.sets.reduce((setTotal, set) => setTotal + (Number(set.reps) || 0), 0);
      }, 0);
  }, 0);

  const averageReps = totalSets > 0 ? (totalReps / totalSets).toFixed(1) : 0;


  // Dynamically create a unique list of all exercises ever logged
  const allExercises = [
    ...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))
  ];

  return (
    <div className="space-y-8 bg-gray-900">

      {/* --- NEW: High-Level Stats Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
        <StatCard title="Total Workouts" value={totalWorkouts} />
        <StatCard title="Overall Volume" value={overallVolume.toLocaleString()} unit="kg" />
        <StatCard title="Average Reps / Set" value={averageReps} />
      </div>

      {/* --- ENHANCED: Progress Tracking Section --- */}

      <div className="bg-background-medium p-6 rounded-lg  ">
        <h2 className="text-2xl text-center  text-white font-bold mb-4">Track Your Progress</h2>
        {workouts.length > 0 ? (
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-amber-50 ">
              {/* Exercise Dropdown (your existing code) */}
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary  placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">-- Select an exercise --</option>
                {allExercises.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              
              {/* NEW: Metric Dropdown */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="maxWeight">Max Weight Lifted</option>
                <option value="totalVolume">Total Volume</option>
                <option value="averageReps">Average Reps</option>
              </select>
            </div>

            
            {/* Conditionally render the chart */}
            {selectedExercise && (
              <div className="mt-4">

                {/* --- IMPORTANT: Pass the new 'metric' prop to the chart --- */}
                <ProgressChart 
                  workouts={workouts} 
                  exerciseName={selectedExercise}
                  metric={selectedMetric} 
                />

              </div>
            )}
          </>
        ) : (
          <p className="text-text-secondary">Log a workout to start tracking progress.</p>
        )}
      </div>

      {/* Workout History Section */}
      <WorkoutHistory />
    </div>
  );
}