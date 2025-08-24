
// src/components/WorkoutLogForm.jsx (Verified and Corrected)

import { useState, useEffect } from 'react';
// FIXED: Import the API function from your dedicated API file
import { fetchAllExercises } from '../api/wger'; // Adjust the path if it's different

// --- Helper Functions (These are good and can stay) ---
const generateNumericOptions = (start, end) => {
  const options = [];
  for (let i = start; i <= end; i++) {
    options.push({ value: i, label: `${i}` });
  }
  return options;
};

const generateWeightOptions = (start, end, step) => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push({ value: i.toFixed(2), label: `${i.toFixed(2)} kg` });
  }
  return options;
};

// Pre-generate the options
const SETS_OPTIONS = generateNumericOptions(1, 10);
const REPS_OPTIONS = generateNumericOptions(1, 30);
const WEIGHT_OPTIONS = generateWeightOptions(2.5, 200, 1.25);



export default function WorkoutLogForm({ onSaveWorkout, onCancel }) {
  // Overall workout state
  const [workoutName, setWorkoutName] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState([]);

  // State for the form itself
  const [apiExercises, setApiExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [numberOfSets, setNumberOfSets] = useState(3);
  
  // FIXED: Initialize setsData with unique objects for each set
  const [setsData, setSetsData] = useState(() => 
    Array.from({ length: 3 }, () => ({ reps: '8', weight: '20' }))
  );
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exercises from API on component mount
  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllExercises(); // Now uses the correct, imported function
        console.log("Verifying first exercise from API:", data[0]); 
        setApiExercises(data);
      } catch (err) {
        setError(err.message || 'Could not load exercises.');
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  // This effect correctly syncs the setsData array when numberOfSets changes
  useEffect(() => {
    setSetsData(currentSets => {
      const newSetsData = Array.from({ length: numberOfSets }, (_, index) => {
        return currentSets[index] || { reps: '8', weight: '20' };
      });
      return newSetsData;
    });
  }, [numberOfSets]);

  const handleSetDataChange = (index, field, value) => {
    // FIXED: Use .map to create a new array with a new object for the changed set (immutable update)
    const newSetsData = setsData.map((set, i) => {
      if (i === index) {
        return { ...set, [field]: value }; // Create a new object for the item we want to change
      }
      return set; // Return the original object for all other items
    });
    setSetsData(newSetsData);
  };


  const handleAddExerciseToWorkout = () => {
    if (!selectedExerciseId) {
      alert('Please select an exercise.');
      return;
    }
    const selectedExerciseData = apiExercises.find(ex => ex.id === parseInt(selectedExerciseId));

    const newExercise = {
      id: selectedExerciseData.id,
      name: selectedExerciseData.name_translations?.en || selectedExerciseData.name || "Unnamed Exercise",
      category: selectedExerciseData.category, // still just ID
      sets: setsData,
    };

    
    
    setCurrentWorkout([...currentWorkout, newExercise]);


    // Reset the form for the next exercise
    setSelectedExerciseId('');
    setNumberOfSets(3);
    // FIXED: Reset with unique objects
    setSetsData(Array.from({ length: 3 }, () => ({ reps: '8', weight: '20' })));
  };


  const handleSubmit = () => {
    if (currentWorkout.length === 0) {
      alert('Please add at least one exercise to your workout.');
      return;
    }
    const finalWorkout = {

      id: Date.now(),
      name: workoutName || `Workout on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),

      exercises: currentWorkout,
    };
    onSaveWorkout(finalWorkout);

  };
  return (
    <div className="space-y-6">

      {/* Section 1: Main Form */}
      <div className="bg-background-medium p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Log New Workout</h2>
        <input
          type="text"
          placeholder="Workout Name (e.g., Push Day)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full p-3 bg-background-dark border border-border rounded-lg mb-6"
        />
        <div className="border-t border-border pt-4">
          <h3 className="text-xl font-semibold mb-3">Add an Exercise</h3>
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            disabled={loading || error}
            className="w-full p-3 bg-background-dark text-text-primary border border-border rounded-lg mb-4"
          >
            <option 
              value=""
              className="bg-background-medium text-text-secondary"              
              >
                {loading ? 'Loading exercises...' : error ? error : '-- Select an Exercise --'}
                </option>
               {/* 🔎 Debug log here */}
               {console.log("Exercise check:", apiExercises.map(ex => ({
                 id: ex.id,
                 name: ex.name,
                 translations: ex.name_translations,
                 category: ex.category
                })))}
              
              {/* FIXED: Added classes directly to the <option> tag */}
              {apiExercises.map(ex => (
              <option 
                key={ex.id} 
                value={ex.id}
                // This is the critical fix. It forces each option to have your theme's colors.
                className="bg-background-medium text-text-primary"
              >
                {ex.name || ex.name_translations?.en || "Unnamed Exercise"}
                </option>
              ))}
            </select>
            
          {/* NEW: Dropdown to control the number of sets */}
          <div className="mb-4">
              <label htmlFor="numSets" className="block text-sm font-medium text-text-secondary mb-1">Number of Sets</label>
              <select 
                id="numSets" 
                value={numberOfSets} 
                onChange={(e) => setNumberOfSets(Number(e.target.value))}
                className="w-full p-3 bg-background-dark text-text-primary border border-border rounded-lg"
              >
                  {SETS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}className="bg-background-medium text-text-primary"
                  >
                    {opt.label}</option>)}
              </select>
          </div>

          {/* Dynamically rendered dropdowns for each set */}
          {setsData.map((set, index) => (
            <div key={index} className="flex items-center gap-3 mb-3 p-3 bg-background-dark rounded-md">
              <span className="text-sm font-medium text-text-secondary w-1/4">Set {index + 1}</span>
              <select value={set.reps} onChange={(e) => handleSetDataChange(index, 'reps', e.target.value)} className="w-1/2 p-2 bg-background-dark text-text-primary border border-border rounded-lg">
                {REPS_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-
                background-medium text-text-primary">{opt.label} 
                reps</option>)}
              </select>
              <select value={set.weight} onChange={(e) => handleSetDataChange(index, 'weight',
               e.target.value)} className="w-1/2 p-2 bg-background-dark text-text-primary border border-border 
               rounded-lg">
                {WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}className="bg-background-medium text-text-primary">{opt.label}</option>)}
              </select>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleAddExerciseToWorkout}
              className="px-6 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/90 font-medium"
            >
              Add Exercise to Workout
            </button>

          </div>
        </div>
      </div>


      {/* --- Section 2: Current Workout Summary --- */}
      {currentWorkout.length > 0 && (
        <div className="bg-background-medium p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Current Workout Summary</h3>
          <div className="space-y-3">
            {currentWorkout.map((ex, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-background-dark rounded-md">
                <span className="font-semibold">{ex.name}</span>
                <span className="text-text-secondary">{ex.sets.length} {ex.sets.length > 1 ? 'sets' : 'set'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Section 3: Final Action Buttons --- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-blue- text-text-primary rounded-lg hover:bg-gray-500 font-medium">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={currentWorkout.length === 0}
          className="flex-1 px-6 py-3 bg-success text-text-primary rounded-lg hover:bg-success/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Full Workout
        </button>

      </div>
    </div>
  );
}