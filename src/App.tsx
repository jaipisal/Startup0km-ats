import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployerLayout from "./components/EmployerLayout";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobsManagement from "./pages/employer/JobsManagement";
import CandidatePipeline from "./pages/employer/CandidatePipeline";
import JobseekerLayout from "./components/JobseekerLayout";
import JobBoard from "./pages/jobseeker/JobBoard";
import MyApplications from "./pages/jobseeker/MyApplications";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// ─────────────────────────────────────────────
// Route-level redirect based on auth + role
// ─────────────────────────────────────────────
function AuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (user) {
      // After login, navigate to correct dashboard based on role
      if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
        navigate(user.role === "employer" ? "/employer" : "/jobseeker", { replace: true });
      }
    }
  }, [user, loading, navigate, location.pathname]);

  return null;
}

// Protected route wrapper
function RequireAuth({ role, children }: { role: "employer" | "jobseeker"; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "employer" ? "/employer" : "/jobseeker"} replace />;
  return <>{children}</>;
}

import { GlobalBackground } from "./components/GlobalBackground";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalBackground />
          <AuthRedirect />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Employer routes — protected */}
            <Route
              path="/employer"
              element={
                <RequireAuth role="employer">
                  <EmployerLayout />
                </RequireAuth>
              }
            >
              <Route index element={<EmployerDashboard />} />
              <Route path="jobs" element={<JobsManagement />} />
              <Route path="candidates" element={<CandidatePipeline />} />
            </Route>

            {/* Jobseeker routes — protected */}
            <Route
              path="/jobseeker"
              element={
                <RequireAuth role="jobseeker">
                  <JobseekerLayout />
                </RequireAuth>
              }
            >
              <Route index element={<JobBoard />} />
              <Route path="applications" element={<MyApplications />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
