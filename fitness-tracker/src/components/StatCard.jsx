
export default function StatCard({ title, value, unit }) {
    return (
      <div className="bg-background-medium p-4 rounded-lg shadow-2xl text-center  transition transform hover:scale-105 hover:shadow-2xl 
        cursor-pointer">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-primary mt-1">
          {value} <span className="text-xl font-medium text-text-secondary">{unit}</span>
        </p>
      </div>
    );
  }