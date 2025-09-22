// src/api/realtimeDb.js
import { db } from "../firebase";
import { ref, push, set, get, child } from "firebase/database";

// Save a workout for a specific user
export async function saveWorkoutToRTDB(userId, workout) {
  
  try {
    // Create a new unique key under workouts
    const workoutRef = push(ref(db, `users/${userId}/workouts`));
    await set(workoutRef, {
      ...workout,
      createdAt: Date.now() // RTDB doesn’t support serverTimestamp
    });
    return workoutRef.key;
  } catch (e) {
    console.error("Error adding workout: ", e);
    throw new Error("Could not save workout.");
  }
}

// Get all workouts for a specific user
export async function getWorkoutsFromRTDB(userId) {
  try {
    const snapshot = await get(child(ref(db), `users/${userId}/workouts`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert { key: value } into array
      return Object.entries(data)
        .map(([id, workout]) => ({ id, ...workout }))
        .sort((a, b) => b.createdAt - a.createdAt); // newest first
    }
    return [];
  } catch (e) {
    console.error("Error fetching workouts: ", e);
    throw new Error("Could not fetch workouts.");
  }
}
