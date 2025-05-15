import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const SensorDataContext = createContext();

export const SensorDataProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState([]);
  const { socket } = useSocket(); // ✅ FIXED

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("sensorData", (data) => {
      setSensorData((prev) => [data, ...prev.slice(0, 49)]);
    });

    return () => {
      socket.off("connect");
      socket.off("sensorData");
    };
  }, [socket]);

  return (
    <SensorDataContext.Provider value={{ sensorData }}>
      {children}
    </SensorDataContext.Provider>
  );
};

export const useSensorData = () => useContext(SensorDataContext);
