import { useState, useEffect } from 'react';

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);

  // Load workouts from localStorage when the component first renders
  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    // Sort workouts by date, newest first
    savedWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setWorkouts(savedWorkouts);
  }, []); // Empty array ensures this runs only once on mount

  // Handle the case where no workouts have been logged
  if (workouts.length === 0) {
    return (
      <div className="bg-background-medium p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">No History Found</h2>
        <p className="text-text-secondary">Log your first workout to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Workout History</h1>
      {workouts.map(workout => (
        <div key={workout.id} className="bg-background-medium p-6 rounded-lg shadow-lg">
          
          {/* Workout Header */}
          <div className="mb-4 border-b border-border pb-2">
            <h2 className="text-2xl font-bold text-primary">{workout.name}</h2>
            <p className="text-sm text-text-secondary">
              {new Date(workout.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <table className="w-full text-left mt-2">
                  <thead>
                    <tr className="text-text-secondary text-sm">
                      <th className="p-2">Set</th>
                      <th className="p-2">Reps</th>
                      <th className="p-2">Weight (kg)</th>
                      <th className="p-2">Rest (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex} className="border-t border-border">
                        <td className="p-2 font-medium">{setIndex + 1}</td>
                        <td className="p-2">{set.reps}</td>
                        <td className="p-2">{set.weight}</td>
                        <td className="p-2">{set.rest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}