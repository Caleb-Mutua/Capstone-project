import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProgressChart({ workouts, exerciseName }) {
  // 1. Transform the raw workout data into something the chart can use
  const chartDataPoints = workouts
    .map(workout => {
      // Find the specific exercise within the workout
      const exercise = workout.exercises.find(
        e => e.name.toLowerCase() === exerciseName.toLowerCase()
      );
      
      if (!exercise) return null; // Ignore workouts where this exercise wasn't done
      
      // Calculate the max weight lifted for this exercise in this session
      const maxWeight = Math.max(...exercise.sets.map(s => Number(s.weight) || 0));
      
      return { date: workout.date, maxWeight };
    })
    .filter(Boolean) // Remove any nulls
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure dates are in order

  // 2. Format the data for Chart.js
  const data = {
    labels: chartDataPoints.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [{
      label: `Max Weight for ${exerciseName} (kg)`,
      data: chartDataPoints.map(p => p.maxWeight),
      borderColor: '#3B82F6', // Corresponds to your `primary` color
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.2
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#F9FAFB' } }, // text-text-primary
      title: { display: true, text: 'Progress Over Time', color: '#F9FAFB' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9CA3AF' } }, // text-text-secondary
      x: { ticks: { color: '#9CA3AF' } }
    }
  };

  return <Line options={options} data={data} />;
}