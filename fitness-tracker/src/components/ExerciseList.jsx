import { useState, useEffect } from 'react';
import { fetchExercises, fetchMuscleGroups } from '../api/wger';

export default function ExerciseList({ onExerciseSelect, selectedExercises = [] }) {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const [exercisesData, muscleGroupsData] = await Promise.all([
          fetchExercises(),
          fetchMuscleGroups()
        ]);
        
        setExercises(exercisesData);
        setMuscleGroups(muscleGroupsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  useEffect(() => {
    async function searchExercises() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExercises(searchTerm, selectedMuscleGroup);
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchExercises, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedMuscleGroup]);

  const isExerciseSelected = (exerciseId) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  const handleExerciseClick = (exercise) => {
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  if (loading && exercises.length === 0) {
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
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input text-lg pr-12"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted">
            🔍
          </div>
        </div>
        
        <select
          value={selectedMuscleGroup}
          onChange={(e) => setSelectedMuscleGroup(e.target.value)}
          className="input"
        >
          <option value="">All Muscle Groups</option>
          {muscleGroups.map(muscle => (
            <option key={muscle.id} value={muscle.id}>
              {muscle.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading indicator for search */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="spinner w-8 h-8"></div>
        </div>
      )}

      {/* Exercise Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                className={`card p-6 cursor-pointer hover-lift group animate-fade-in ${
                  isExerciseSelected(exercise.id) 
                    ? 'ring-2 ring-primary shadow-glow' 
                    : 'hover:ring-2 hover:ring-primary/30'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-primary group-hover:text-primary-light transition-colors">
                    {exercise.name}
                  </h3>
                  {isExerciseSelected(exercise.id) && (
                    <span className="badge-success">✓ Selected</span>
                  )}
                </div>
                
                {exercise.category && (
                  <div className="badge-primary mb-3">{exercise.category.name}</div>
                )}
                
                {exercise.muscles && exercise.muscles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-text-muted mb-2 uppercase tracking-wide font-medium">Targeted Muscles</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles.slice(0, 3).map(muscle => (
                        <span
                          key={muscle.id}
                          className="badge-accent"
                        >
                          {muscle.name}
                        </span>
                      ))}
                      {exercise.muscles.length > 3 && (
                        <span className="badge-secondary">
                          +{exercise.muscles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {exercise.description && (
                  <div 
                    className="text-sm text-text-secondary line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: exercise.description.length > 150 
                        ? exercise.description.substring(0, 150) + '...' 
                        : exercise.description 
                    }} 
                  />
                )}

                {/* Hover effect indicator */}
                <div className="mt-4 pt-4 border-t border-border/20">
                  <div className="flex items-center justify-between text-sm text-text-muted group-hover:text-text-secondary transition-colors">
                    <span>Click to add</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-text-secondary">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-medium">No exercises found</p>
              <p className="text-sm mt-2">Try adjusting your search terms or muscle group filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && exercises.length > 0 && (
        <div className="text-center py-4">
          <p className="text-text-secondary">
            Showing {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            {selectedMuscleGroup && ' for selected muscle group'}
          </p>
        </div>
      )}
    </div>
  );
}
