import useSensorsStore from "@/store/useSensorsStore";
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const Socket = () => {
  const socketRef = useRef(null);
  const {updateManholes} = useSensorsStore();

  useEffect(() => {
    // Connect to socket
    socketRef.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket.IO connected in the main component');
    });

    socket.on('sensorData', (results) => {
      try {
        console.log('Received sensor data from ESP32:', results.data);
        updateManholes(results.data); // Push to Zustand store
      } catch (err) {
        console.error('Error updating dashboard data:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return null; // no UI
};

export default Socket;
