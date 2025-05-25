// import ForgotPassword from "./pages/auth/forgot-password/route";
// import SignIn from "./pages/auth/sign-in/route";
// import SignUp from "./pages/auth/sign-up/route";
// import Otp from "./pages/auth/otp/route";
import Table from "./pages/tables/Table"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DashboardMainPage from "./pages/dashboard/drainx-dashboard";
import NotFoundError from "./pages/error/404";
import Dashboard from "./pages/dashboard/board/Dashboard";
// import SensorsData from "./pages/dashboard/sensor-data/SensorsData";
import SensorsData from "./pages/dashboard/A_web_socket/senserData/sensorData1.jsx"
import Manholes from "./pages/dashboard/manholes/Manholes";
import Alerts from "./pages/dashboard/alerts/Alerts";
import Users from "./pages/dashboard/users/Users";
import Docs from "./pages/dashboard/docs/Docs";
import MaintenanceLogs from "./pages/dashboard/maintenance-logs/MaintenanceLogs";
import SettingsPage from "./pages/dashboard/settings/Settings";
import Map from "./pages/dashboard/map/map";
import Navbar from "@/components/sections/navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { HeroSection } from "@/components/sections/hero";
import { SponsorsSection } from "@/components/sections/sponsors";
import { BenefitsSection } from "@/components/sections/benefits";
import { FeaturesSection } from "@/components/sections/features";
import { ServicesSection } from "@/components/sections/services";
import { TestimonialSection } from "@/components/sections/testimonial";
import { TeamSection } from "@/components/sections/teams";
import { CommunitySection } from "@/components/sections/community";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";
import { FAQSection } from "@/components/sections/faq";
import { FooterSection } from "@/components/sections/footer";
import ForgotPassword from "./components/auth/Forgot-password";
import { useUserStore } from "./store/useUserStore";
import Loading from "./components/sections/Loader";
import { useEffect } from "react";
// import EmailVerified from "./components/auth/Email-verified";
import VerifyEmail from "./components/auth/VerifyEmail";
import ResetPassword from "./components/auth/Reset-password";
import WorkerDashboard from "./pages/dashboard/worker-task/worker-dashboard";
import AdminDashboard from "./pages/dashboard/assignments/assignments";
import { CreateTaskForm } from "./pages/dashboard/assignments/createTask";



// Router configuration
const router = createBrowserRouter([
  // Home route
  {
    path: "/",
    element: (
      <div className="md:max-w-full mx-auto">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <ServicesSection />
        <PricingSection />
        <TestimonialSection />
        <TeamSection />
        <CommunitySection />
        <SponsorsSection />
        <FAQSection />
        <ContactSection />
        <FooterSection />
      </div>
    ),
  },

  // Authentication routes
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/login",
    element: (
      <AuthenticatedUser>
        <Login />
      </AuthenticatedUser>
    )
  },
  {
    path: "/signup",
    element: (
      <AuthenticatedUser>
        <Signup />
      </AuthenticatedUser>
    )
  },
  {
    path: "/sensor",
    element: <Table />
  },
  {
    path: "/verify-email",
    element: (
      <AuthenticatedUser>
        <VerifyEmail />
      </AuthenticatedUser>
    )
  },
  {
    path: "/forgot-password",
    element: (
      <AuthenticatedUser>
        <ForgotPassword />
      </AuthenticatedUser>
    )
  },

  // Admin Dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <DashboardMainPage />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <RoleBasedRedirect />
      },
      {
        path: "sensor-readings",
        element: (
          <AdminRoute>
            <SensorsData />
          </AdminRoute>
        )
      },
      {
        path: "manholes",
        element: (
          <AdminRoute>
            <Manholes />
          </AdminRoute>
        )
      },
      {
        path: "alerts",
        element: (
          <AdminRoute>
            <Alerts />
          </AdminRoute>
        )
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        )
      },
      {
        path: "maintenance",
        element: (
          <AdminRoute>
            <MaintenanceLogs />
          </AdminRoute>
        )
      },
      {
        path: "settings",
        element: (
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        )
      },
      {
        path: "docs",
        element: (
          <AdminRoute>
            <Docs />
          </AdminRoute>
        )
      },
      {
        path: "map",
        element: (
          <AdminRoute>
            <Map />
          </AdminRoute>
        )
      },
      {
        path: "admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
        children: [{
          path: "create-task",
          element: (
            <AdminRoute>
              <CreateTaskForm />
            </AdminRoute>
          )
        }]
      },
      {
        path: "worker-dashboard",
        element: (
          <WorkerRoute>
            <WorkerDashboard />
          </WorkerRoute>
        )
      }
    ],
  },
  {
    path: "/create-task",
    element: (
      <AdminRoute>
        <CreateTaskForm />
      </AdminRoute>
    )
  },
  // Error handling route
  {
    path: "/404",
    element: <NotFoundError />,
  },
  // Fallback route
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useUserStore();

  if (user?.role === "admin") {
    return <Navigate to="/dashboard/admin-dashboard" replace />;
  } else if (user?.role === "worker") {
    return <Navigate to="/dashboard/worker-dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

// Worker Route protection
const WorkerRoute = ({ children }) => {
  const { user, isAuthenticated, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "worker") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected Routes component (updated)
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If you want to enforce email verification
  // if (!user?.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  return children;
};

// Authenticated User component (updated)
const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Admin Route protection (updated)
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Component (updated)
function App() {
  const { checkAuthentication, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return <RouterProvider router={router} />;
}



export default App;