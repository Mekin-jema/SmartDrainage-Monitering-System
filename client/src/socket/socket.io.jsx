import useAlertStore from "@/store/useAlertStore";
import { useManholeStore } from "@/store/useManholeStore";
import useSensorsStore from "@/store/useSensorsStore";
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const Socket = () => {
  const socketRef = useRef(null);
  const { updateManhole } = useManholeStore();


  const { updateSensor } = useSensorsStore()
  const { updateAlerts}=useAlertStore()
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'; // Default to localhost if not set

  useEffect(() => {
    // Connect to socket
    socketRef.current = io('/api', {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });


    socketRef.current = io(SOCKET_URL, {

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

        updateSensor(results.data); // Push to Zustand store
      } catch (err) {
        console.error('Error updating dashboard data:', err);
      }
    });
    socket.on('manholeData', (results) => {
      try {
        console.log('Received Manholes data from wokwi:', results.data);
        updateManhole(results.data); // Push to Zustand store
      } catch (err) {
        console.error('Error updating dashboard data:', err);
      }
    });


        socket.on('alertData', (results) => {
      try {
        console.log('Received Manholes data from wokwi:', results.data);
        updateManhole(results.data); // Push to Zustand store
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
