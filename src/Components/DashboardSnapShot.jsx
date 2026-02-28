import { Link } from "react-router-dom";

export default function DashboardSnapshot() {
  const today = new Date().toLocaleDateString();

  return (
    <section className="px-6 py-10 bg-yellow-50 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Today’s Snapshot – {today}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Journal Preview */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-blue-600">Latest Journal</h3>
          <p className="text-gray-600 mt-2">“Reflected on my progress today...”</p>
          <Link to="/journal" className="text-sm text-blue-500 mt-3 inline-block">
            Continue Writing →
          </Link>
        </div>

        {/* Tasks */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-green-600">Top Tasks</h3>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Finish UI prototype</li>
            <li>Plan tomorrow’s goals</li>
            <li>Quick workout</li>
          </ul>
          <Link to="/tasks" className="text-sm text-green-500 mt-3 inline-block">
            Manage Tasks →
          </Link>
        </div>

        {/* Mood Tracker */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-pink-600">Mood Today</h3>
          <p className="text-4xl mt-2">😊</p>
          <Link to="/mood" className="text-sm text-pink-500 mt-3 inline-block">
            Log Mood →
          </Link>
        </div>
      </div>
    </section>
  );
}