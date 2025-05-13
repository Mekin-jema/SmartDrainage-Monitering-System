import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const MAINTENANCE_API = 'http://localhost:3000/api/v1/maintenances'; // Adjust endpoint as needed
axios.defaults.withCredentials = true;

const useMaintenanceStore = create(
  persist(
    (set) => ({
      maintenanceLogs: [],
      loading: false,
      error: null,

      // Fetch all logs with optional filters
      fetchMaintenanceLogs: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${MAINTENANCE_API}/get`, { params: filters });
          if (response.data.success) {
            set({ maintenanceLogs: response.data.maintenanceLogs, loading: false });
          } else {
            set({ error: 'Failed to fetch maintenance logs', loading: false });
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Server error', loading: false });
        }
      },

      // Create a new maintenance log
      createMaintenanceLog: async (payload) => {
        try {
          const response = await axios.post(`${MAINTENANCE_API}/create`, payload);
          if (response.data.success) {
            set((state) => ({
              maintenanceLogs: [response.data.data, ...state.maintenanceLogs],
            }));
            return { success: true };
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Creation error' });
          return { success: false, error: err.response?.data?.message };
        }
      },

      // Update maintenance status
      updateMaintenanceStatus: async (logId, updateData) => {
        try {
          const response = await axios.patch(`${MAINTENANCE_API}/status/${logId}`, updateData);
          if (response.data.success) {
            set((state) => ({
              maintenanceLogs: state.maintenanceLogs.map((log) =>
                log._id === logId ? response.data.data : log
              ),
            }));
            return { success: true };
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Update error' });
          return { success: false, error: err.response?.data?.message };
        }
      },

      // Add parts to an existing log
      addMaintenanceParts: async (logId, parts) => {
        try {
          const response = await axios.patch(`${MAINTENANCE_API}/parts/${logId}`, { parts });
          if (response.data.success) {
            set((state) => ({
              maintenanceLogs: state.maintenanceLogs.map((log) =>
                log._id === logId ? { ...log, partsReplaced: response.data.data } : log
              ),
            }));
            return { success: true };
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Add parts error' });
          return { success: false, error: err.response?.data?.message };
        }
      },
    }),
    {
      name: 'maintenance-store',
      partialize: (state) => ({
        maintenanceLogs: state.maintenanceLogs,
      }),
    }
  )
);

export default useMaintenanceStore;
