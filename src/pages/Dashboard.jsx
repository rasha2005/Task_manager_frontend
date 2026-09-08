import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  LayoutGrid,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getDashboard } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ title, value, icon: Icon, colorScheme = "slate", subtitle }) => {
  const schemeMap = {
    indigo: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    slate: "border-slate-800 bg-slate-900/50 text-slate-400",
  };

  const selectedScheme = schemeMap[colorScheme] || schemeMap.slate;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-white">
            {value ?? 0}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-lg border p-2.5 transition-transform group-hover:scale-105 ${selectedScheme}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-16 w-1/3 rounded-xl bg-slate-800/60" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-slate-800/40" />
      ))}
    </div>
    <div className="space-y-4 pt-4">
      <div className="h-8 w-1/4 rounded-lg bg-slate-800/60" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-800/40" />
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await getDashboard();
        setData(response);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 lg:p-10 text-slate-100">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-red-500/10 p-4 text-red-400 border border-red-500/20 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-white">Dashboard Unavailable</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 text-slate-100 space-y-10 antialiased">
      {/* Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || "User"} 
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here is an overview of your organization's activity and assigned work.
          </p>
        </div>
        {user?.role && (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <UserCheck className="h-3.5 w-3.5" />
            <span className="capitalize">{user.role}</span>
          </div>
        )}
      </div>

      {/* Organization Level Overview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Organization Overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Users"
            value={data?.organization?.totalUsers}
            icon={Users}
            colorScheme="indigo"
          />
          <StatCard
            title="Total Tasks"
            value={data?.organization?.totalTasks}
            icon={ListTodo}
            colorScheme="slate"
          />
          <StatCard
            title="To Do"
            value={data?.tasks?.todo}
            icon={ListTodo}
            colorScheme="blue"
          />
          <StatCard
            title="In Progress"
            value={data?.tasks?.inProgress}
            icon={Clock}
            colorScheme="amber"
          />
          <StatCard
            title="Completed"
            value={data?.tasks?.completed}
            icon={CheckCircle2}
            colorScheme="emerald"
          />
        </div>
      </section>

      {/* Personal Tasks Section */}
      {data?.myTasks && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold tracking-tight text-white">
              My Workspace Summary
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="My Assigned Tasks"
              value={data.myTasks.total}
              icon={ListTodo}
              colorScheme="slate"
              subtitle="Total tasks assigned to you"
            />
            <StatCard
              title="My To Do"
              value={data.myTasks.todo}
              icon={ListTodo}
              colorScheme="blue"
              subtitle="Pending action items"
            />
            <StatCard
              title="My In Progress"
              value={data.myTasks.inProgress}
              icon={Clock}
              colorScheme="amber"
              subtitle="Currently being worked on"
            />
            <StatCard
              title="My Completed"
              value={data.myTasks.completed}
              icon={CheckCircle2}
              colorScheme="emerald"
              subtitle="Finished tasks"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;