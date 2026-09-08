import { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  User,
  Flag,
  ListTodo,
  X,
  Check,
  FileText,
} from "lucide-react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import { getUsers } from "../services/userService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  });

  const loadData = async () => {
    try {
      setError("");

      const [taskData, userData] = await Promise.all([
        getTasks(),
        getUsers(),
      ]);

      setTasks(taskData.tasks);
      setUsers(userData.users);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createTask({
        ...form,
        assignedTo: form.assignedTo || null,
      });

      setForm({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
      });

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");

      await updateTask(id, { status });

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      setError("");

      await deleteTask(id);

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);

    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      assignedTo: task.assignedTo?._id || "",
    });

    setError("");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);

    setForm({
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
    });

    setError("");
  };

  const handleUpdate = async (task) => {
    try {
      setError("");

      await updateTask(task._id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        status: task.status,
      });

      setEditingTaskId(null);

      setForm({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
      });

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
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

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 text-slate-100 space-y-8 antialiased">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-indigo-400" />
            Task Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize, assign, and track workspace task activities.
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

      {/* Create Task Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-5">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Create New Task</h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <FileText className="h-4 w-4" />
            </div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task Title..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add task description or details..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            rows={3}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {/* Priority */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Flag className="h-4 w-4" />
              </div>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 capitalize"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Assigned User */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-indigo-400" />
          <span>All Tasks ({tasks.length})</span>
        </h2>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-md"
            >
              {editingTaskId === task._id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-semibold text-white">
                      Edit Task Details
                    </h3>
                  </div>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Task title"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-3 pr-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>

                    <select
                      name="assignedTo"
                      value={form.assignedTo}
                      onChange={handleChange}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>

                    <select
                      value={task.status}
                      onChange={(e) => {
                        setTasks(
                          tasks.map((t) =>
                            t._id === task._id
                              ? { ...t, status: e.target.value }
                              : t
                          )
                        );
                      }}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleUpdate(task)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal View Mode */
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEditing(task)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Tags & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Tag */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        <Flag className="h-3 w-3" />
                        {task.priority} Priority
                      </span>

                      {/* Assigned Tag */}
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                        <User className="h-3 w-3 text-indigo-400" />
                        {task.assignedTo?.name ? (
                          <span className="text-slate-200">
                            {task.assignedTo.name}
                          </span>
                        ) : (
                          "Unassigned"
                        )}
                      </span>
                    </div>

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
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500 backdrop-blur-sm">
              <CheckSquare className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-base font-medium">No tasks found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a new task above to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;