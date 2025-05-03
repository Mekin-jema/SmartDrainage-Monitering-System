// import { AmbaBoard } from "./components";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import DashboardMainPage from "./pages/dashboard/amba-dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NotFoundError from "./pages/error/404";
import ForgotPassword from "./pages/auth/forgot-password/route";
import SignIn from "./pages/auth/sign-in/route";
import SignUp from "./pages/auth/sign-up/route";
import Otp from "./pages/auth/otp/route";
import Dashboard from "./pages/dashboard/board/Dashboard";
import SensorsData from "./pages/dashboard/sensor-data/SensorsData";
import Manholes from "./pages/dashboard/manholes/Manholes";
import Alerts from "./pages/dashboard/alerts/Alerts";
import Users from "./pages/dashboard/users/Users";
import RepairsInspection from "./pages/dashboard/repairs-inspection/RepairsInspection";
import Settings from "./pages/dashboard/system-settings/Settings";
import Docs from "./pages/dashboard/docs/Docs";
import MaintenanceLogs from "./pages/dashboard/maintenance-logs/MaintenanceLogs";
import SettingsPage from "./pages/dashboard/settings/Settings";
import Map  from "./pages/dashboard/map/map";
import { HeroSection } from "./sections/hero";
import { SponsorsSection } from "./sections/sponsors";
import { BenefitsSection } from "./sections/benefits";
import { FeaturesSection } from "./sections/features";
import { ServicesSection } from "./sections/services";
import { TestimonialSection } from "./sections/testimonial";
import { TeamSection } from "./sections/teams";
import { CommunitySection } from "./sections/community";
import { PricingSection } from "./sections/pricing";
import { ContactSection } from "./sections/contact";
import { FAQSection } from "./sections/faq";
import { FooterSection } from "./sections/footer";
import { Navbar } from "./sections/navbar";

const router = createBrowserRouter([


  { path: "/404", element: <NotFoundError /> },

  {
    path: "/dashboard",
    element: <DashboardMainPage />,
    children: [
      { index: true, element: <Dashboard  /> },

      ,

      {
        path: "sensor-readings",
        element: <SensorsData />,

      },
      { path: "manholes", element: <Manholes /> },
      { path: "alerts", element: <Alerts /> },
      { path: "users", element: <Users /> },
      // { path: "map", element: <Map /> },
      , {
        path: "maintenance"
        , element: <MaintenanceLogs />
      },
      { path: "repairs", element: <RepairsInspection /> },
      ,{
        path: "settings", element:<SettingsPage/>
      }
      ,{
        path:"docs",element:<Docs/>
      }
      ,{
        path:"map",element:<Map/>
      }
     
      
      // {
      //   path: "users",
      //   element: <Users />,
      //   loader: usersLoader,
      //   children:[
      //     { path: "invite", element: <UserInvite /> },
      //     { path: "add", element: <UserAdd /> },
      //     {path:"delete",element:<UserDelete/>}
      //   ]

      // }
      // ... other nested routes
    ],
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/otp",
    element: <Otp />
  },
  {
    path: "/signup",
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },

  {
    path: "*", element: <Navigate to="/404" replace />,
  },

]);

function App() {
  return <RouterProvider router={router} >
    <div>
      <Navbar/>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <TeamSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </div>

  </RouterProvider>;
}

export default App;