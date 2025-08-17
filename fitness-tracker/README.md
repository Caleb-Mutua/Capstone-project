# Fitness Tracker App

A comprehensive fitness tracking application built with React, Tailwind CSS, and the WGER API. Track your workouts, monitor progress, and explore exercises with detailed information.

## 🚀 Features

### Core Functionality
- **Workout Logging**: Log detailed workouts with exercises, sets, reps, weights, and rest times
- **Exercise Database**: Browse and search through thousands of exercises from the WGER API
- **Progress Tracking**: Visual charts showing weight, reps, and volume progress over time
- **Workout History**: Complete workout history with filtering and search capabilities
- **Responsive Design**: Mobile-first design that works on all devices

### Advanced Features
- **Exercise Selection**: Choose exercises from a comprehensive database with muscle group filtering
- **Progress Analytics**: Multiple chart types showing different aspects of your fitness journey
- **Search & Filter**: Find exercises by name, category, or muscle group
- **Local Storage**: All data is saved locally for privacy and offline access
- **Error Handling**: Robust error handling with user-friendly messages

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router DOM
- **API**: WGER Fitness API
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- WGER API key (free at [wger.de](https://wger.de))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fitness-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_WGER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Getting a WGER API Key

1. Visit [wger.de](https://wger.de)
2. Create a free account
3. Go to your profile settings
4. Generate an API token
5. Copy the token to your `.env` file

## 📱 Usage

### Dashboard
- View quick stats and recent workouts
- Access quick actions for logging workouts and viewing progress
- Browse available exercises

### Log Workout
1. Click "Browse Exercises" to see the exercise database
2. Search and filter exercises by name or muscle group
3. Click on exercises to add them to your workout
4. Set reps, weight, and rest time for each set
5. Add multiple sets and exercises as needed
6. Save your workout

### View History & Progress
- **Workout History Tab**: View all logged workouts with filtering options
- **Progress Tracking Tab**: Select exercises to view detailed progress charts
- **Monthly Progress**: See workout frequency over time

### Exercise Explorer
- Search through thousands of exercises
- Filter by muscle groups
- View exercise descriptions and targeted muscles
- Select exercises for your workouts

## 🎯 Project Requirements Met

### ✅ Functional Requirements
- [x] **Log Workouts**: Complete workout logging with exercises, sets, reps, weights, and timestamps
- [x] **Workout History**: Organized workout history with search and filter capabilities
- [x] **Progress Tracking**: Visual progress charts for weight, reps, and volume
- [x] **WGER API Integration**: Fetch exercise data, descriptions, and muscle group information
- [x] **Search Functionality**: Search exercises by name, category, and muscle group
- [x] **Responsive Design**: Mobile-first design using Tailwind CSS
- [x] **Error Handling**: Comprehensive error handling for API failures and user input

### ✅ Technical Requirements
- [x] **React Project Setup**: Configured with Vite and modern tooling
- [x] **Tailwind CSS**: Fully configured with custom color scheme
- [x] **API Integration**: Fetch and axios-like functionality with error handling
- [x] **Component Architecture**: Reusable components for all major features
- [x] **State Management**: React hooks for local state management
- [x] **Responsive Layout**: Consistent design across all screen sizes

## 🏗️ Project Structure

```
src/
├── api/
│   └── wger.js          # WGER API integration
├── components/
│   ├── ExerciseList.jsx     # Exercise browsing and selection
│   ├── ProgressChart.jsx    # Progress visualization
│   ├── WorkoutHistory.jsx   # Workout history display
│   ├── WorkoutLogForm.jsx   # Workout logging form
│   └── Navbar.jsx           # Navigation component
├── pages/
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Logworkout.jsx       # Workout logging page
│   └── History&Progress.jsx # History and progress tracking
├── App.jsx                  # Main app component
└── main.jsx                 # App entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and highlights
- **Success**: Green (#22C55E) - Success states and confirmations
- **Background**: Dark theme with multiple levels
- **Text**: High contrast for readability
- **Borders**: Subtle borders for component separation

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Optimized for readability

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_WGER_API_KEY`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variable in Vercel dashboard

## 🔮 Future Enhancements

### Stretch Goals
- [ ] User authentication and cloud storage
- [ ] Personalized exercise recommendations
- [ ] Custom workout plan creation
- [ ] Diet and nutrition tracking
- [ ] Dark/light mode toggle
- [ ] Social sharing features
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Common Issues
1. **API Key Error**: Ensure your WGER API key is correctly set in `.env`
2. **Build Errors**: Clear `node_modules` and reinstall dependencies
3. **Chart Display Issues**: Check browser console for JavaScript errors

### Performance Tips
- The app uses local storage for data persistence
- Exercise data is cached to reduce API calls
- Search is debounced for better performance

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Built with ❤️ using React and Tailwind CSS**

