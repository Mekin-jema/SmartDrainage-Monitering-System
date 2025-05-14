import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/Store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@/pages/dashboard/theme-provider";
import { Toaster } from "./components/ui/toaster";
// import MapComponent from "./pages/demo";
import { SocketProvider } from "./pages/dashboard/A_web_socket/useContext/SocketContext";
// import { SensorDataProvider } from "./pages/dashboard/A_web_socket/useContext/SensorDataContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider storageKey="vite-ui-theme">
        <SocketProvider>
          <App />
          {/* <MapComponent/> */}
        </SocketProvider>
        {/* <MapComponent/> */}
        <Toaster />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </StrictMode>
);