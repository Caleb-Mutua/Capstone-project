// src/components/WorkoutLogForm.jsx (Updated)

import { useState } from 'react';
import ExerciseList from './ExerciseList';

export default function WorkoutLogForm({ onSaveWorkout, onCancel }) {
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [showExerciseList, setShowExerciseList] = useState(false);

  // --- NEW: State for the manual input field ---
  const [manualExerciseName, setManualExerciseName] = useState('');

  const addExercise = (exercise) => {
    // This function is for adding from the browsed list
    const newExercise = {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category?.name || 'Unknown',
      muscles: exercise.muscles || [],
      sets: [{ reps: '', weight: '', rest: '' }]
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseList(false);
  };

  // --- NEW: Handler for the manual add button ---
  const handleAddManualExercise = () => {
    if (!manualExerciseName.trim()) {
      alert('Please enter an exercise name.');
      return;
    }
    const newExercise = {
      id: `manual-${Date.now()}`, // Give it a unique ID
      name: manualExerciseName.trim(),
      category: 'Custom',
      muscles: [],
      sets: [{ reps: '', weight: '', rest: '' }]
    };
    setExercises([...exercises, newExercise]);
    setManualExerciseName(''); // Clear the input field
  };

  // ... (keep all your other functions: removeExercise, updateExercise, updateSet, addSet, removeSet, handleSubmit, totalVolume)
  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '', rest: '' });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      setExercises(newExercises);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exercises.length === 0) {
      alert('Please add at least one exercise to your workout.');
      return;
    }
    const workout = {
      id: Date.now(),
      name: workoutName || `Workout ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      exercises: exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(set => set.reps && set.weight)
      }))
    };
    onSaveWorkout(workout);
  };

  const totalVolume = exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exTotal, set) => {
      const reps = parseInt(set.reps) || 0;
      const weight = parseFloat(set.weight) || 0;
      return exTotal + (reps * weight);
    }, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-background-medium p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Log New Workout</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Workout Name (e.g., Chest Day)"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
          />

          {/* --- NEW: Manual Add Section --- */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Or type an exercise name here"
              value={manualExerciseName}
              onChange={(e) => setManualExerciseName(e.target.value)}
              className="flex-1 p-3 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddManualExercise}
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Add
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowExerciseList(!showExerciseList)}
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              {showExerciseList ? 'Hide Exercise List' : 'Browse Full List'}
            </button>
            {exercises.length > 0 && (
              <div className="text-text-secondary">
                <span className="font-medium">Total Volume:</span> {totalVolume.toFixed(1)} kg
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The rest of your component remains the same */}
      {showExerciseList && (
        <div className="bg-background-medium p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Select Exercises from List</h3>
          <ExerciseList 
            onExerciseSelect={addExercise}
            selectedExercises={exercises}
          />
        </div>
      )}

      {/* ... (keep the rest of your JSX for Selected Exercises and Action Buttons) ... */}
      {exercises.length > 0 && (
        <div className="bg-background-medium p-6 rounded-lg">
          {/* ... existing code to display exercises ... */}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* ... existing action buttons ... */}
      </div>
    </div>
  );
}