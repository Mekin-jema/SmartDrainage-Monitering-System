import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_ALERT_ENDPOINT = `/api/v1/alerts`;
// axios.defaults.withCredentials = true;

const useAlertStore = create(
  persist(
    (set) => ({
      alerts: [],
      recentAlerts: [],
      loading: false,
      error: null,

      // Fetch all alerts (with optional filters)
      fetchAlerts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_ALERT_ENDPOINT}/recent`);
          console.log('Response from fetchAlerts:', response);
          if (response) {
            set({ alerts: response.data.recentAlerts, loading: false });
          } else {
            set({ error: 'Failed to load alerts', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },
      
      
      updateAlerts: (newData) => {
  set((state) => ({
    recentAlerts : newData, // Or do deduplication/merge here
  }));
},
      // Fetch 5 recent alerts
      fetchRecentAlerts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_ALERT_ENDPOINT}/recent`);
          if (response.data.success) {
            set({ recentAlerts: response.data.recentAlerts, loading: false });
          } else {
            set({ error: 'Failed to load recent alerts', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },

      // Create a new alert
      createAlert: async (alertData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_ALERT_ENDPOINT}/create`, alertData);
          if (response.data.success) {
            set((state) => ({
              alerts: [response.data.data, ...state.alerts],
              loading: false,
            }));
          } else {
            set({ error: 'Failed to create alert', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },

      // Update alert status
      updateAlertStatus: async (alertId, payload) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.patch(`${API_ALERT_ENDPOINT}/${alertId}/status`, payload);
          if (response.data.success) {
            set((state) => ({
              alerts: state.alerts.map((alert) =>
                alert._id === alertId ? response.data.data : alert
              ),
              loading: false,
            }));
          } else {
            set({ error: 'Failed to update alert status', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },

      // Add resolution notes
      addResolutionNotes: async (alertId, payload) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.patch(`${API_ALERT_ENDPOINT}/${alertId}/notes`, payload);
          if (response.data.success) {
            set((state) => ({
              alerts: state.alerts.map((alert) =>
                alert._id === alertId ? response.data.data : alert
              ),
              loading: false,
            }));
          } else {
            set({ error: 'Failed to add notes', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'alert-storage',
      partialize: (state) => ({
        alerts: state.alerts,
        recentAlerts: state.recentAlerts,
      }),
    }
  )
);

export default useAlertStore;
