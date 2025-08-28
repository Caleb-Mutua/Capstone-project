// src/api/wger.js (The Final, Verified Version)

const API_URL = 'https://wger.de/api/v2';
const API_KEY = import.meta.env.VITE_WGER_API_KEY;

/**
 * A centralized API client that handles all fetch requests.
 * It adds the Authorization header and provides clear error messages.
 * @param {string} endpoint The API endpoint to call (e.g., '/exerciseinfo/')
 * @returns {Promise<any>} The JSON response data from the API
 */
async function apiClient(endpoint) {
  // 1. Fail Fast: Check for the key immediately.
  if (!API_KEY) {
    throw new Error('API Key is missing. Check your .env file and ensure it is named VITE_WGER_API_KEY.');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Authorization': `Token ${API_KEY}` },
  });

  // 2. Handle HTTP response errors
  if (!response.ok) {
    if (response.status === 403) throw new Error('API request failed: Invalid API Key.');
    throw new Error(`API request failed with status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches and normalizes the main list of all exercises for your components.
 * @returns {Promise<Array>} A clean list of exercise objects.
 */
export async function fetchAllExercises() {
  try {
   
    const data = await apiClient('/exerciseinfo/?language=2&limit=300');
    
    // BEST PRACTICE: Normalize the data to fix API inconsistencies.
    const normalizedData = data.results
      .map(ex => {
        const normalizedName = ex.name_translations?.en?.trim() || ex.name?.trim();
        if (normalizedName) {
          return { ...ex, name: normalizedName };
        }
        return null;
      })
      .filter(Boolean);

    return normalizedData;
  } catch (error) {
    console.error("Error in fetchAllExercises:", error);
    throw error;
  }
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