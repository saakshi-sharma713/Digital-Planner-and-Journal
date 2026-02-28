import { useEffect, useState } from "react";
import axios from "axios";
import MoodChart from "../Components/MoodChart";
import TodoStatus from "../Components/TodoStatus";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeGoals: 0,
    avgMood: 0,
    completionRate: 0,
  });

  const [tasksTrend, setTasksTrend] = useState([]);
  const [moodTrend, setMoodTrend] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [summaryRes, tasksRes, moodRes, goalsRes] = await Promise.all([
        axios.get("http://localhost:8990/api/dashboard/summary", { headers }),
        axios.get("http://localhost:8990/api/dashboard/tasks-trend", { headers }),
        axios.get("http://localhost:8990/api/dashboard/mood-trend", { headers }),
        axios.get("http://localhost:8990/api/dashboard/goals", { headers }),
      ]);

      setSummary(summaryRes.data);
      setTasksTrend(tasksRes.data);
      setMoodTrend(moodRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#ffe0d6] min-h-screen flex items-center justify-center">
        <p className="text-[#cc4422] font-bold animate-bounce">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#ed7851] min-h-screen space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-5 gap-6">
        <Card title="Total Tasks" value={summary.totalTasks} />
        <Card title="Completed" value={summary.completedTasks} />
        <Card title="Active Goals" value={summary.activeGoals} />
        <Card title="Avg Mood" value={summary.avgMood} />
        <Card title="Completion %" value={`${summary.completionRate}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Tasks (Last 7 Days)">
          <TodoStatus/>
        </ChartCard>

        <ChartCard title="Mood">
          {moodTrend.length > 0 ? (
            <MoodChart data={moodTrend} />
          ) : (
            <EmptyState message="No mood data yet." />
          )}
        </ChartCard>
      </div>

      {/* Goals */}
      <ChartCard title="Goals Progress">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="mb-4">
              <p className="text-sm font-medium text-[#cc4422] mb-4">{goal.goal_name}</p>
              <div className="w-full bg-[#ffe0d6] rounded-full h-5 overflow-hidden mb-2">
                <div
                  className="h-5 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${goal.progress}%`,
                    background: "linear-gradient(to right, #ff0000, #ff7f00, #ffff00)",
                  }}
                />
              </div>
              <p className="text-xs mt-1 text-[#991f11]">{goal.progress}%</p>
            </div>
          ))
        ) : (
          <EmptyState message="No goals yet — add one to start tracking!" />
        )}
      </ChartCard>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform">
      <p className="text-[#ff6633] text-sm font-semibold tracking-wide">{title}</p>
      <h2 className="text-3xl font-extrabold mt-2">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#ffc2ad]">
      <h2 className="text-lg font-bold mb-4 text-[#ff6633]">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center text-[#ff7f50] text-sm italic py-6 animate-pulse">
      {message}
    </div>
  );
}