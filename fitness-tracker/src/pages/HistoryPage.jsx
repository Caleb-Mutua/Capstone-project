import { useState, useEffect } from 'react';
import WorkoutHistory from '../components/WorkoutHistory';
import ProgressChart from '../components/ProgressChart';

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
  }, []);

  // Dynamically create a unique list of all exercises ever logged
  const allExercises = [
    ...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))
  ];

  return (
    <div className="space-y-8">
      {/* Progress Tracking Section */}
      <div className="bg-background-medium p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
        {workouts.length > 0 ? (
          <>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none mb-4"
            >
              <option value="">-- Select an exercise --</option>
              {allExercises.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            
            {/* Conditionally render the chart */}
            {selectedExercise && (
              <div className="mt-4">
                <ProgressChart workouts={workouts} exerciseName={selectedExercise} />
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