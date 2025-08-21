import { useState, useEffect } from 'react';

// This function will live in a separate file in a real app, e.g., src/api/wger.js
async function fetchExercises() {
  const API_URL = 'https://wger.de/api/v2/exerciseinfo/?language=2&limit=300';
  const API_KEY = import.meta.env.VITE_WGER_API_KEY; // Make sure your .env file is set up!

  try {
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok. Check your API Key.');
    }
    const data = await response.json();
    // Filter out exercises without a name, which can sometimes happen
    return data.results.filter(ex => ex.name && ex.name.trim() !== '');
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    // Re-throw the error so the component can catch it
    throw error;
  }
}

export default function ExerciseList({ onExerciseSelect, selectedExercises }) {
  // 1. State Management
  const [allExercises, setAllExercises] = useState([]); // Master list from API
  const [filteredExercises, setFilteredExercises] = useState([]); // List to display
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data ONCE when the component mounts
  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExercises();
        setAllExercises(data);
        setFilteredExercises(data); // Initially, show all exercises
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []); // Empty array means this effect runs only once

  // 3. Filter exercises when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredExercises(allExercises);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allExercises.filter(ex =>
      ex.name.toLowerCase().includes(lowercasedTerm) ||
      ex.category.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredExercises(filtered);
  }, [searchTerm, allExercises]); // This effect runs whenever searchTerm or allExercises change

  // Get a list of IDs of exercises already in the workout
  const selectedIds = new Set(selectedExercises.map(ex => ex.id));

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