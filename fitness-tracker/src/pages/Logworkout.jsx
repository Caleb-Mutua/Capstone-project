// src/pages/LogWorkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutLogForm from '../components/WorkoutLogForm';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveWorkout = async (workout) => {
    try {
      setIsSubmitting(true);
      
      // Save to localStorage
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
      savedWorkouts.unshift(workout);
      localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
      
      // Show success message
      alert('Workout saved successfully!');
      
      // Navigate to history page
      navigate('/history');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <WorkoutLogForm 
        onSaveWorkout={handleSaveWorkout}
        onCancel={handleCancel}
      />
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background-medium p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-primary">Saving workout...</p>
          </div>
        </div>
      )}
    </div>
  );
}