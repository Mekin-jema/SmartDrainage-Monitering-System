import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DashboardMainPage from "./pages/dashboard/amba-dashboard";
import NotFoundError from "./pages/error/404";
// import ForgotPassword from "./pages/auth/forgot-password/route";
import SignIn from "./pages/auth/sign-in/route";
import SignUp from "./pages/auth/sign-up/route";
import Otp from "./pages/auth/otp/route";
import Dashboard from "./pages/dashboard/board/Dashboard";
import SensorsData from "./pages/dashboard/sensor-data/SensorsData";
import Manholes from "./pages/dashboard/manholes/Manholes";
import Alerts from "./pages/dashboard/alerts/Alerts";
import Users from "./pages/dashboard/users/Users";
import RepairsInspection from "./pages/dashboard/repairs-inspection/RepairsInspection";
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
import { useUserStore } from "./Redux/useUserStore";



const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};
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

  // Dashboard routes

  {path:"/login",element:<Login/>},
  {path:"/signup",element:<Signup/>},
  {
    path: "/dashboard",
    element: <DashboardMainPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "sensor-readings", element: <SensorsData /> },
      { path: "manholes", element: <Manholes /> },
      { path: "alerts", element: <Alerts /> },
      { path: "users", element: <Users /> },
      { path: "maintenance", element: <MaintenanceLogs /> },
      { path: "repairs", element: <RepairsInspection /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "docs", element: <Docs /> },
      { path: "map", element: <Map /> },
    ],
  },

  // Authentication routes
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/signup",
    element: <SignUp />, // Add component for SignUp if needed
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
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



// App Component
function App() {
  return (
    <RouterProvider router={router}>
      {/* The content is routed and displayed by the Router */}
    </RouterProvider>
  );
}

export default App;
