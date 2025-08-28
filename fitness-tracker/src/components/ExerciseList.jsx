// src/components/ExerciseList.jsx 

import { useState, useEffect } from 'react';
import { fetchAllExercises, fetchMuscleGroups } from '../api/wger'; // Adjust path if needed

function ExerciseCard({ exercise, isSelected, onSelect, animationDelay }) {
  return (
    <div
      onClick={() => onSelect(exercise)}
      className={`card p-6 cursor-pointer hover-lift group animate-fade-in ${
        isSelected ? 'ring-2 ring-primary shadow-glow' : 'hover:ring-2 hover:ring-primary/30'
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-xl text-primary group-hover:text-primary-light transition-colors">
          {exercise.name}
        </h3>
        {isSelected && (
          <span className="badge-success">✓ Selected</span>
        )}
      </div>
      
      {exercise.category?.name && (
        <div className="badge-primary mb-3">{exercise.category.name}</div>
      )}
      
      {exercise.muscles?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wide font-medium">Targeted Muscles</p>
          <div className="flex flex-wrap gap-2">
            {exercise.muscles.slice(0, 3).map(muscle => (
              <span key={muscle.id} className="badge-accent">{muscle.name}</span>
            ))}
            {exercise.muscles.length > 3 && (
              <span className="badge-secondary">+{exercise.muscles.length - 3}</span>
            )}
          </div>
        </div>
      )}
      
      {exercise.description && (
        <div 
          className="text-sm text-text-secondary line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: exercise.description }} 
        />
      )}
    </div>
  );
}


export default function ExerciseList({ onExerciseSelect, selectedExercises = [] }) {
  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        const [exercisesData, muscleGroupsData] = await Promise.all([
          fetchAllExercises(),
          fetchMuscleGroups()
        ]);
        setAllExercises(exercisesData);
        setFilteredExercises(exercisesData);
        setMuscleGroups(muscleGroupsData);
      } catch (err) {
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    let result = [...allExercises];

    if (selectedMuscleGroup) {
      result = result.filter(ex =>
        ex.muscles?.some(muscle => muscle.id === parseInt(selectedMuscleGroup))
      );
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(ex =>
        ex.name?.toLowerCase().includes(lowercasedTerm) ||
        ex.category?.name?.toLowerCase().includes(lowercasedTerm)
      );
    }

    setFilteredExercises(result);
}, [searchTerm, selectedMuscleGroup, allExercises]);

  const selectedExerciseIds = new Set(selectedExercises.map(ex => ex.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-red-400">
        <p className="font-medium text-lg">Error loading exercises:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises by name or category..."
            value={searchTerm}
            // FIXED: Corrected the typo from e.g.et.value to e.target.value
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input text-lg pr-12"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted">🔍</div>
        </div>
        
        <select
          value={selectedMuscleGroup}
          onChange={(e) => setSelectedMuscleGroup(e.target.value)}
          className="input"
        >
          <option value="">All Muscle Groups</option>
          {muscleGroups.map(muscle => (
            <option key={muscle.id} value={muscle.id}>{muscle.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isSelected={selectedExerciseIds.has(exercise.id)}
              onSelect={onExerciseSelect}
              animationDelay={index * 50}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-text-secondary">
            <div className="text-6xl mb-4">🤷</div>
            <p className="text-lg font-medium">No exercises found</p>
            <p className="text-sm mt-2">Try adjusting your search terms or muscle group filter.</p>
          </div>
        )}
      </div>

      {!loading && (
        <div className="text-center py-4 text-text-secondary">
          <p>Showing {filteredExercises.length} of {allExercises.length} exercises</p>
        </div>
      )}
    </div>
  );
}