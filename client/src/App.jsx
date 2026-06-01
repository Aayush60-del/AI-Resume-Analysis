import "./App.css";
import "./responsive.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthPage from "./Components/AuthPage";
import DemoAnalysisPage from "./Components/DemoAnalysisPage";
import HomePage from "./Components/HomePage";
import AnalysisPage from "./Components/AnalysisPage";
import DashboardPage from "./Components/DashboardPage";
import NotFoundPage from "./Components/NotFoundPage";
import OptimizationsPage from "./Components/OptimizationsPage";
import RegisterPage from "./Components/RegisterPage";
import SettingsPage from "./Components/SettingsPage";
import StaticInfoPage from "./Components/StaticInfoPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import GuestRoute from "./routes/GuestRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <AuthPage />
      </GuestRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/demo",
    element: <DemoAnalysisPage />,
  },
  {
    path: "/info/:page",
    element: <StaticInfoPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analysis",
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard" replace />
      </ProtectedRoute>
    )
  },
  {
    path: "/analysis/:id",
    element: (
      <ProtectedRoute>
        <AnalysisPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/optimizations",
    element: (
      <ProtectedRoute>
        <OptimizationsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
