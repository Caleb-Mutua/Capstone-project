// src/api/wger.js (Refined)

const API_URL = 'https://wger.de/api/v2';
const API_KEY = import.meta.env.VITE_WGER_API_KEY;

/**
 * A centralized API client to handle all fetch requests.
 * It automatically adds the Authorization header and handles response errors.
 * @param {string} endpoint The API endpoint to call (e.g., '/exerciseinfo/')
 * @param {object} options The options for the fetch call
 * @returns {Promise<any>} The JSON response data
 */
async function apiClient(endpoint, options = {}) {
  const headers = { ...options.headers };

  // Only add Authorization header if API_KEY exists
  if (API_KEY) {
    headers['Authorization'] = `Token ${API_KEY}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('API request failed: Invalid API Key.');
    }
    throw new Error(`API request failed with status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches the main list of all exercises. This is what you'll use for your dropdowns.
 * @returns {Promise<Array>} A list of exercise objects.
 */
export async function fetchAllExercises() {
  const response = await fetch('https://wger.de/api/v2/exercise/?limit=300');
  const data = await response.json();
  return data.results; // not data
}



/**
 * Fetches the list of all available muscle groups.
 * @returns {Promise<Array>} A list of muscle group objects.
 */
export async function fetchMuscleGroups() {
  try {
    const data = await apiClient('/muscle/');
    
    return data.results;
  } catch (error) {              
    console.error("Error in fetchMuscleGroups:", error);
    throw error;
  }
}

// You can add other specific functions like fetchExerciseDetails if you need them
// export async function fetchExerciseDetails(exerciseId) { ... }