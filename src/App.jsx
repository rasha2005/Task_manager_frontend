import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import MyTasks from "./pages/MyTasks";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute publicOnly>
              <Login />
            </ProtectedRoute>
          }
        />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <Tasks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <MyTasks />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;