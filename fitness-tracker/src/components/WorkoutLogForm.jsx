// src/components/WorkoutLogForm.jsx (Refined for Better UX)

import { useState } from 'react';
import ExerciseList from './ExerciseList';

export default function WorkoutLogForm({ onSaveWorkout, onCancel }) {
  // --- State Management (Your state logic is solid and remains the same) ---
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [manualExerciseName, setManualExerciseName] = useState('');

  // --- Handlers (Your handlers are also well-written and remain the same) ---
  const addExercise = (exercise) => {
    if (exercises.some(ex => ex.id === exercise.id)) {
      alert('This exercise is already in your workout.');
      return;
    }
    const newExercise = {
      id: exercise.id,
      name: exercise.name,
      category: exercise.category?.name || 'Unknown',
      muscles: exercise.muscles || [],
      sets: [{ reps: '', weight: '', rest: '' }]
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
    setShowExerciseList(false);
  };
  
  const handleAddManualExercise = () => {
    if (!manualExerciseName.trim()) {
      alert('Please enter an exercise name.');
      return;
    }
    if (exercises.some(ex => ex.name.toLowerCase() === manualExerciseName.trim().toLowerCase())) {
      alert('This exercise is already in your workout.');
      return;
    }
    const newExercise = {
      id: `manual-${Date.now()}`,
      name: manualExerciseName.trim(),
      category: 'Custom',
      muscles: [],
      sets: [{ reps: '', weight: '', rest: '' }]
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
    setManualExerciseName('');
  };

  const removeExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setExercises(prev => 
      prev.map((ex, i) => {
        if (i === exerciseIndex) {
          const newSets = ex.sets.map((set, j) => {
            if (j === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          });
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const addSet = (exerciseIndex) => {
    setExercises(prev => 
      prev.map((ex, i) => {
        if (i === exerciseIndex) {
          return { ...ex, sets: [...ex.sets, { reps: '', weight: '', rest: '' }] };
        }
        return ex;
      })
    );
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setExercises(prev => 
      prev.map((ex, i) => {
        if (i === exerciseIndex && ex.sets.length > 1) {
          const newSets = ex.sets.filter((_, j) => j !== setIndex);
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exercises.length === 0) {
      alert('Please add at least one exercise.');
      return;
    }
    const workout = {
      id: Date.now(),
      name: workoutName.trim() || `Workout on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      exercises: exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(set => set.reps && set.weight) // Filter out empty sets on save
      }))
    };
    onSaveWorkout(workout);
  };

  const totalVolume = exercises.reduce((total, ex) => 
    total + ex.sets.reduce((exTotal, set) => 
      exTotal + (parseInt(set.reps) || 0) * (parseFloat(set.weight) || 0), 0), 0);

  // --- JSX (This is where the refinement happens) ---
  return (
    <div className="space-y-6">
      {/* Section 1: Workout Setup & Adding Exercises */}
      <div className="bg-background-medium p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Log New Workout</h2>
        <input
          type="text"
          placeholder="Workout Name (e.g., Chest Day)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full p-3 bg-background-dark border border-border rounded-lg mb-4"
        />
        <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-lg font-semibold">Add Exercises to Your Workout</h3>
            <div className="flex items-center gap-2">
                <input
                type="text"
                placeholder="Type to add an exercise manually"
                value={manualExerciseName}
                onChange={(e) => setManualExerciseName(e.target.value)}
                className="flex-1 p-3 bg-background-dark border border-border rounded-lg"
                />
                <button
                type="button"
                onClick={handleAddManualExercise}
                className="px-6 py-3  bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-color"
                >
                Add
                </button>
            </div>
            <div className="text-center text-text-secondary">or</div>
            <button
              type="button"
              onClick={() => setShowExerciseList(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-color shadow-md"
            >
              Browse Full Exercise List
            </button>
        </div>
      </div>

      {/* A modal-like view for the full exercise list */}
      {showExerciseList && (
        // The backdrop is perfect, no changes needed here
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4 animate-fade-in-fast">
            
            {/* FIXED: Replaced the custom color with a standard Tailwind color */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Select Exercises from List</h3>
                <button onClick={() => setShowExerciseList(false)} className="text-2xl">&times;</button>
              </div>
              <ExerciseList 
                onExerciseSelect={addExercise}
                selectedExercises={exercises}
              />
            </div>
        </div>
      )}

      {/* Section 2: Logging Details for Added Exercises */}
      {exercises.length > 0 && (
        <div className="bg-background-medium p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Your Workout Plan</h3>
            <div className="text-text-secondary">
              <span className="font-medium">Total Volume:</span> {totalVolume.toFixed(1)} kg
            </div>
          </div>
          {exercises.map((exercise, exIndex) => (
             <div key={exercise.id} className="border-t border-border/50 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg text-primary">{exercise.name}</h4>
                 <button type="button" onClick={() => removeExercise(exIndex)} className="text-red-500 hover:text-red-400 text-sm">Remove</button>
              </div>
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-1 text-sm text-text-secondary">Set {setIndex + 1}</span>
                    <input type="number" placeholder="Reps" value={set.reps} onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)} className="col-span-3 p-2 rounded bg-background-dark border border-border" />
                    <input type="number" placeholder="Weight (kg)" value={set.weight} onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)} className="col-span-3 p-2 rounded bg-background-dark border border-border" />
                    <input type="number" placeholder="Rest (s)" value={set.rest} onChange={(e) => updateSet(exIndex, setIndex, 'rest', e.target.value)} className="col-span-4 p-2 rounded bg-background-dark border border-border" />
                    {exercise.sets.length > 1 && (
                      <button type="button" onClick={() => removeSet(exIndex, setIndex)} className="col-span-1 text-red-500 hover:text-red-400 text-center">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addSet(exIndex)} className="text-sm text-primary hover:underline mt-2">+ Add Set</button>
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Final Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-color shadow-md ">Cancel</button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={exercises.length === 0}
          className="flex-1 px-6 py-3  bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-color disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
}