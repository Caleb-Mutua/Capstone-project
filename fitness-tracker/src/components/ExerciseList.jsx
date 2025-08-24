// src/components/ExerciseList.jsx (Verified and Refined)

import { useState, useEffect } from 'react';

// REFINED: Your wger.js file should export these functions
import { fetchAllExercises, fetchMuscleGroups } from '../api/wger'; // Adjust path if needed

export default function ExerciseList({ onExerciseSelect, selectedExercises = [] }) {
  // --- State Management ---
  // REFINED: We now have a "master list" and a "filtered list"
  const [allExercises, setAllExercises] = useState([]); // Master list from API, never changes.
  const [filteredExercises, setFilteredExercises] = useState([]); // The list that gets displayed.
  
  const [muscleGroups, setMuscleGroups] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // --- Effect 1: Fetch all data ONCE on component mount ---
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both lists in parallel for efficiency
        const [exercisesData, muscleGroupsData] = await Promise.all([
          fetchAllExercises(),
          fetchMuscleGroups()
        ]);

        setAllExercises(exercisesData); // Set the master list
        setFilteredExercises(exercisesData); // Initially, the filtered list is the same
        setMuscleGroups(muscleGroupsData);

      } catch (err) {
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }

    
    loadInitialData();
  }, []); // Empty array ensures this runs only once.

  // --- Effect 2: Perform CLIENT-SIDE filtering whenever filters change ---
  // FIXED: This effect no longer makes API calls. It's now instant.
  useEffect(() => {
    let result = [...allExercises]; // Start with the full master list

    // 1. Filter by selected muscle group first
    if (selectedMuscleGroup) {
      result = result.filter(exercise => 
        // WGER `exerciseinfo` has a `muscles` array of objects with `id` and `name`
        exercise.muscles.some(muscle => muscle.id === parseInt(selectedMuscleGroup))
      );
    }

    // 2. Filter by search term on the remaining items
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(exercise =>
        exercise.name.toLowerCase().includes(lowercasedTerm) ||
        exercise.category.name.toLowerCase().includes(lowercasedTerm)
      );
    }

    setFilteredExercises(result);
  }, [searchTerm, selectedMuscleGroup, allExercises]); // Re-run this logic if filters or the master list change.

  // --- Helper Functions ---
  const isExerciseSelected = (exerciseId) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  // --- Render Logic ---
  if (loading) {
    return <div className="text-center p-6 text-text-secondary">Loading exercises...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-red-400">
        <p className="font-medium text-lg">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search exercises by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
      />

      {loading && <p className="text-text-secondary">Loading exercises...</p>}
      
      {error && <p className="text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
          {filteredExercises.length > 0 ? (
            filteredExercises.map(exercise => (
              <div key={exercise.id} className="flex items-center justify-between p-3 bg-background-dark rounded-lg">
                <div>
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-text-secondary">{exercise.category.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onExerciseSelect(exercise)}
                  disabled={selectedIds.has(exercise.id)}
                  className="px-4 py-2 bg-primary text-text-primary rounded-lg text-sm font-medium transition-colors hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {selectedIds.has(exercise.id) ? 'Added' : 'Add'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-text-secondary">No exercises found.</p>
          )}
        </div>
      )}
    </div>
  );
}