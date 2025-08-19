import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// The component now accepts a 'metric' prop
export default function ProgressChart({ workouts, exerciseName, metric }) {
  // We'll define these dynamically
  let chartLabel = '';
  let chartUnit = '';

  // 1. Transform the raw workout data based on the selected metric
  const chartDataPoints = workouts
    .map(workout => {
      // Find the specific exercise within the workout
      const exercise = workout.exercises.find(
        e => e.name.toLowerCase() === exerciseName.toLowerCase()
      );
      
      if (!exercise) return null; // Ignore workouts where this exercise wasn't done
      
      let value = 0;
      // This switch statement is the new core logic
      switch (metric) {
        case 'totalVolume':
          chartLabel = `Total Volume for ${exerciseName}`;
          chartUnit = 'kg';
          // Calculate volume: SUM of (reps * weight) for all sets
          value = exercise.sets.reduce((total, set) => {
            return total + (Number(set.reps) || 0) * (Number(set.weight) || 0);
          }, 0);
          break;
        
        case 'averageReps':
          chartLabel = `Average Reps for ${exerciseName}`;
          chartUnit = 'reps';
          const totalReps = exercise.sets.reduce((total, set) => total + (Number(set.reps) || 0), 0);
          value = exercise.sets.length > 0 ? totalReps / exercise.sets.length : 0;
          break;

        case 'maxWeight':
        default: // Your original logic is now the default case
          chartLabel = `Max Weight for ${exerciseName}`;
          chartUnit = 'kg';
          value = Math.max(...exercise.sets.map(s => Number(s.weight) || 0));
          break;
      }
      
      return { date: workout.date, value }; // We use a generic 'value' property
    })
    .filter(Boolean) // Remove any nulls
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure dates are in order

  // 2. Format the data for Chart.js using our dynamic variables
  const data = {
    labels: chartDataPoints.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [{
      label: `${chartLabel} (${chartUnit})`, // Dynamic label
      data: chartDataPoints.map(p => p.value), // Use the generic 'value'
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.2
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#F9FAFB' } },
      title: { display: true, text: 'Progress Over Time', color: '#F9FAFB' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9CA3AF' } },
      x: { ticks: { color: '#9CA3AF' } }
    }
  };

  return <Line options={options} data={data} />;
}