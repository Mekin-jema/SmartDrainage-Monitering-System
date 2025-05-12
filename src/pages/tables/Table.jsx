import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import './Table.css';

const MAX_DATA_POINTS = 100; // Limit number of stored data points
const SOCKET_URL = 'http://localhost:3000';

const Table = () => {
  const [sensorDataHistory, setSensorDataHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Function to format timestamp
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    if (typeof timestamp === 'string') return timestamp;
    return new Date(timestamp).toLocaleTimeString();
  }, []);

  // Function to process incoming data
  const processSensorData = useCallback((newData) => {
    try {
      // Handle both array and single object data
      const newDataArray = Array.isArray(newData) ? newData : [newData];
      
      // Process each data point
      const processedData = newDataArray.map(item => ({
        ...item,
        timestamp: formatTimestamp(item.timestamp),
        sewage: item.sewage !== undefined ? `${item.sewage} cm` : 'N/A',
        methane: item.methane !== undefined ? `${item.methane} ppm` : 'N/A',
        battery: item.battery !== undefined ? `${item.battery}%` : 'N/A'
      }));

      return processedData;
    } catch (error) {
      console.error('Error processing sensor data:', error);
      return [];
    }
  }, [formatTimestamp]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    });

    // Connection established
    socket.on('connect', () => {
      console.log('Connected to socket.io server');
      setConnectionStatus('connected');
      setError(null);
    });

    // Initial data load
    socket.on('initialData', (initialData) => {
      console.log('Received initial data:', initialData);
      const processedData = processSensorData(initialData || []);
      setSensorDataHistory(processedData.slice(-MAX_DATA_POINTS));
      setIsInitialDataLoaded(true);
    });

    // New sensor data received
    socket.on('sensorData', (newData) => {
      console.log('Received sensor data:', newData);
      const processedData = processSensorData(newData);
      
      setSensorDataHistory(prevHistory => {
        const updatedHistory = [...prevHistory, ...processedData];
        // Keep only the most recent data points
        return updatedHistory.slice(-MAX_DATA_POINTS);
      });
    });

    // Connection errors
    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
      setError('Failed to connect to server. Trying to reconnect...');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [processSensorData]);

  return (
    <div className="table-container">
      <h2>Live Sensor Data</h2>
      <div className={`connection-status ${connectionStatus}`}>
        Status: {connectionStatus} 
        {error && <span className="error-message"> - {error}</span>}
      </div>
      
      <div className="table-wrapper">
        <table className="sensor-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sewage Level</th>
              <th>Methane Level</th>
              <th>Battery Level</th>
            </tr>
          </thead>
          <tbody>
            {isInitialDataLoaded ? (
              sensorDataHistory.length > 0 ? (
                [...sensorDataHistory].reverse().map((data, index) => (
                  <tr key={`${data.timestamp}-${index}`}>
                    <td>{data.timestamp}</td>
                    <td className={data.sewage > 50 ? 'warning' : ''}>
                      {data.sewage}
                    </td>
                    <td className={data.methane > 100 ? 'danger' : ''}>
                      {data.methane}
                    </td>
                    <td className={data.battery < 20 ? 'warning' : ''}>
                      {data.battery}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="4">Loading data...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;