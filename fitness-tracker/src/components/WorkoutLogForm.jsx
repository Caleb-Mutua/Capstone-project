import { useState } from 'react';
import ExerciseList from './ExerciseList';

export default function WorkoutLogForm({ onSaveWorkout, onCancel }) {
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [showExerciseList, setShowExerciseList] = useState(false);

  const addExercise = (exercise) => {
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
        sets: ex.sets.filter(set => set.reps && set.weight) // Only include completed sets
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
      {/* Workout Header */}
      <div className="bg-background-medium p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Log New Workout</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Workout Name (optional)"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full p-3 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
          />
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowExerciseList(!showExerciseList)}
              className="px-6 py-3 bg-primary text-text-primary rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {showExerciseList ? 'Hide Exercise List' : 'Browse Exercises'}
            </button>
            
            {exercises.length > 0 && (
              <div className="text-text-secondary">
                <span className="font-medium">Total Volume:</span> {totalVolume.toFixed(1)} kg
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise List Modal */}
      {showExerciseList && (
        <div className="bg-background-medium p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Select Exercises</h3>
          <ExerciseList 
            onExerciseSelect={addExercise}
            selectedExercises={exercises}
          />
        </div>
      )}

      {/* Selected Exercises */}
      {exercises.length > 0 && (
        <div className="bg-background-medium p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Workout Exercises</h3>
          
          <div className="space-y-6">
            {exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-primary">{exercise.name}</h4>
                    <p className="text-sm text-text-secondary">{exercise.category}</p>
                    {exercise.muscles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.muscles.slice(0, 3).map(muscle => (
                          <span
                            key={muscle.id}
                            className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                          >
                            {muscle.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeExercise(exerciseIndex)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-text-secondary min-w-[60px]">
                        Set {setIndex + 1}
                      </span>
                      
                      <input
                        type="number"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                        className="flex-1 p-2 bg-background-dark border border-border rounded text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      
                      <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={set.weight}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                        className="flex-1 p-2 bg-background-dark border border-border rounded text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      
                      <input
                        type="number"
                        placeholder="Rest (s)"
                        value={set.rest}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'rest', e.target.value)}
                        className="flex-1 p-2 bg-background-dark border border-border rounded text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      
                      {exercise.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(exerciseIndex, setIndex)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addSet(exerciseIndex)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    + Add Set
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-background-dark text-text-secondary border border-border rounded-lg hover:bg-border transition-colors font-medium"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={exercises.length === 0}
          className="flex-1 px-6 py-3 bg-success text-text-primary rounded-lg hover:bg-success/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
}

