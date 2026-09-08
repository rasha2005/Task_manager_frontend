import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">Task Manager</h1>

          <p className="text-sm text-slate-300">
            {user?.name} · {user?.role}
          </p>
        </div>

        <button
          onClick={() => setShowLogoutDialog(true)}
          className="rounded bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-72px)] w-60 bg-white p-4 shadow">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="block rounded px-4 py-2 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            {(user?.role === "admin" || user?.role === "manager") && (
              <Link
                to="/users"
                className="block rounded px-4 py-2 hover:bg-slate-100"
              >
                Users
              </Link>
            )}

            {(user?.role === "admin" || user?.role === "manager") && (
              <Link
                to="/tasks"
                className="block rounded px-4 py-2 hover:bg-slate-100"
              >
                Tasks
              </Link>
            )}

            {user?.role === "employee" && (
              <Link
                to="/my-tasks"
                className="block rounded px-4 py-2 hover:bg-slate-100"
              >
                My Tasks
              </Link>
            )}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">
              Confirm Logout
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

