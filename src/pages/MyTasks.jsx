import { useEffect, useState } from "react";
import {
  CheckSquare,
  AlertCircle,
  Flag,
  Clock,
  CheckCircle2,
  ListTodo,
  Inbox,
} from "lucide-react";

import {
  getMyTasks,
  updateTaskStatus,
} from "../services/taskService";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data.tasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      loadTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500/20 bg-red-500/10 text-red-400";
      case "medium":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      case "low":
      default:
        return "border-slate-700 bg-slate-800 text-slate-300";
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case "completed":
        return "border-l-4 border-l-emerald-500";
      case "in_progress":
        return "border-l-4 border-l-amber-500";
      case "todo":
      default:
        return "border-l-4 border-l-indigo-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 text-slate-100 space-y-8 antialiased">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-indigo-400" />
            My Assigned Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Focus on your active work items and update status in real-time.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Task List Container */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-indigo-400" />
          <span>Assigned To Me ({tasks.length})</span>
        </h2>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`group rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-md ${getStatusBorder(
                task.status
              )}`}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* Metadata & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                  {/* Priority Tag */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    <Flag className="h-3 w-3" />
                    {task.priority} Priority
                  </span>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Status:
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500 backdrop-blur-sm">
              <Inbox className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-base font-medium">All clear!</p>
              <p className="text-xs text-slate-500 mt-0.5">
                No active tasks currently assigned to you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;