import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/Store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@/pages/dashboard/theme-provider";
// import { Toaster } from "./components/ui/toaster";
import Socket from "./socket/socket.io";
import { Toaster } from 'sonner';
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider storageKey="vite-ui-theme">

        <App />
        {/* <Toaster/> */}
        <Toaster richColors position="top-center" />
        <Socket />

      </ThemeProvider>
    </PersistGate>
  </Provider>
);