const API_URL = 'https://wger.de/api/v2';
const API_KEY = import.meta.env.VITE_WGER_API_KEY;

// Debug logging
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Key value:', API_KEY);

// Fallback exercise data for when API is slow/unavailable
const FALLBACK_EXERCISES = [
  {
    id: 1,
    name: "Push-ups",
    category: { name: "Bodyweight" },
    muscles: [{ id: 1, name: "Chest" }, { id: 2, name: "Triceps" }],
    description: "Classic bodyweight exercise for upper body strength"
  },
  {
    id: 2,
    name: "Squats",
    category: { name: "Bodyweight" },
    muscles: [{ id: 3, name: "Quadriceps" }, { id: 4, name: "Glutes" }],
    description: "Fundamental lower body exercise"
  },
  {
    id: 3,
    name: "Pull-ups",
    category: { name: "Bodyweight" },
    muscles: [{ id: 5, name: "Back" }, { id: 6, name: "Biceps" }],
    description: "Upper body pulling exercise"
  },
  {
    id: 4,
    name: "Plank",
    category: { name: "Core" },
    muscles: [{ id: 7, name: "Abs" }, { id: 8, name: "Lower Back" }],
    description: "Isometric core exercise"
  },
  {
    id: 5,
    name: "Lunges",
    category: { name: "Bodyweight" },
    muscles: [{ id: 3, name: "Quadriceps" }, { id: 4, name: "Glutes" }],
    description: "Unilateral lower body exercise"
  }
];

// Helper function to create fetch with timeout
function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export async function fetchExercises(searchTerm = '', muscleGroup = '', retryCount = 0) {
  try {
    let url = `${API_URL}/exerciseinfo/?language=2&limit=300`;
    
    if (muscleGroup) {
      url += `&muscle=${muscleGroup}`;
    }

    console.log('Fetching exercises from:', url);
    console.log('Using API key:', API_KEY);

    const response = await fetchWithTimeout(url, {
      headers: {
        'Authorization': `Token ${API_KEY}`
      }
    }, 15000); // 15 second timeout

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let exercises = data.results.filter(ex => ex.name && ex.name.trim() !== '');

    if (searchTerm) {
      exercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.category && ex.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return exercises;

  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    
    // Retry logic for network errors
    if (retryCount < 2 && (error.message.includes('timeout') || error.message.includes('Failed to fetch'))) {
      console.log(`Retrying... Attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return fetchExercises(searchTerm, muscleGroup, retryCount + 1);
    }
    
    // If all retries failed, use fallback data
    console.log('Using fallback exercise data due to API failure');
    let fallbackExercises = [...FALLBACK_EXERCISES];
    
    if (searchTerm) {
      fallbackExercises = fallbackExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.category && ex.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (muscleGroup) {
      fallbackExercises = fallbackExercises.filter(ex => 
        ex.muscles.some(muscle => muscle.id.toString() === muscleGroup.toString())
      );
    }
    
    return fallbackExercises;
  }
}

export async function fetchMuscleGroups() {
  try {
    const response = await fetch(`${API_URL}/muscle/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;

  } catch (error) {
    console.error("Failed to fetch muscle groups:", error);
    throw new Error('Failed to fetch muscle groups.');
  }
}

export async function fetchExerciseDetails(exerciseId) {
  try {
    const response = await fetch(`${API_URL}/exerciseinfo/${exerciseId}/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch exercise details:", error);
    throw new Error('Failed to fetch exercise details.');
  }
}