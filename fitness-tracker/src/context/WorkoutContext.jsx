// src/context/WorkoutContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // To know if a user is logged in
import { saveWorkoutToRTDB, getWorkoutsFromRTDB } from '../api/realtimeDb'; // Your RTDB functions

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const { currentUser } = useAuth(); // Get the current user from your AuthContext
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect runs when the component mounts AND whenever the user logs in or out.
  useEffect(() => {
    async function loadWorkouts() {
        if (!currentUser?.uid) {
            console.log("User is guest or not ready yet");
            setWorkouts([]);
            setLoading(false);
            return; 
          }
        
        // --- USER IS LOGGED IN ---
        console.log("User is logged in. Fetching from RTDB...");
        setLoading(true);
        try {
        const rtdbWorkouts = await getWorkoutsFromRTDB(currentUser.uid);
        setWorkouts(rtdbWorkouts);
        
        } catch (error) {
        console.error("Error fetching workouts:", error);
        }finally {
         setLoading(false);
        }
      }

      loadWorkouts();
    }, [currentUser]);
    // The dependency array is key: this re-runs the logic on auth change.

    const addWorkout = async (workout) => {
      // --- Step 1: Prepare the new workout object ---
      // We create a new object with a temporary client-side ID and a created date.
      // This allows the UI to render and sort the new item immediately.
      const newWorkout = {
        ...workout,
        id: `temp-${Date.now()}`, // A temporary ID for the React key
        createdAt: new Date(), // A temporary timestamp for sorting
      };
  
      // --- Step 2: Optimistic UI Update ---
      // This happens for BOTH guests and logged-in users, making the UI feel instant.
      setWorkouts(prevWorkouts => [newWorkout, ...prevWorkouts]);
  
      // --- Step 3: Handle Persistence for Logged-in Users ---
      if (currentUser) {
        try {
          // Now, save the original workout data to the database in the background.
          // We don't include the temporary ID. RTDB will generate its own.
          await saveWorkoutToRTDB(currentUser.uid, workout);
          console.log("Workout saved to RTDB for user:", currentUser.uid);
  
          // OPTIONAL BUT RECOMMENDED: After a successful save, you could re-fetch
          // the list to get the real ID and server timestamp, but for now,
          // the optimistic update is sufficient.
          
        } catch (error) {
          console.error("Error saving workout to RTDB, reverting optimistic update:", error);
          
          // If the database save fails, we remove the temporary workout from the UI.
          setWorkouts(prevWorkouts => 
            prevWorkouts.filter(w => w.id !== newWorkout.id)
          );
  
          // Re-throw the error so the calling component (LogWorkoutPage) can catch it
          // and show an alert to the user.
          throw error;
        }
      }
    };
  
  const value = {
    workouts,
    addWorkout,
    loading,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Custom hook for easy consumption
export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
}