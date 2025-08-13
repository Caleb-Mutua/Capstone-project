function App() {
  return (
    // Main container with a light gray background and padding
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {/* Centered content box */}
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
        
        {/* Main Title with Tailwind classes for styling */}
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
          Fitness Tracker
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-700 mb-6">
          Project Setup Complete!
        </p>
        
        {/* A small message indicating next steps */}
        <p className="text-md text-gray-500">
          React, Vite, and Tailwind CSS are all configured correctly. Ready to start building components and fetching API data.
        </p>
        
        {/* A simple styled button to show interactive elements can be styled */}
        <button className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
          Get Started
        </button>

      </div>
    </div>
  );
}

// Don't forget to export the component as the default!
export default App;