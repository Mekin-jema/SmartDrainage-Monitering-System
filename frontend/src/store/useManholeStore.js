import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

// Define the API endpoint for manholesData
const API_ALERT_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/v1/manholes`;
axios.defaults.withCredentials = true;

export const useManholeStore = create(
  persist(
    (set) => ({
      status: {
        totalManholes: 0,
        monitoredManholes: 0,
        criticalIssues: 0,
        maintenanceOngoing: 0,
        systemHealth: 0,
      },
      manholesData: [], // Store the list of manholesData
      loading: false, // Loading state
      error: null, // Error state

      // Action to fetch all manholesData
      fetchManholes: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}`);
          if (response.data.success) {
            set({ manholesData: response.data.data });
          } else {
            set({ error: response.data.message || 'Failed to fetch manholesData' });
          }
        } catch (error) {
          set({ error: error?.response?.data?.message || 'Something went wrong' });
        } finally {
          set({ loading: false });
        }
      },
      fetchSystemStatus: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_END_POINT}/system-status`); // adjust the endpoint as needed
          set({ status: response.data.data, loading: false });
        } catch (error) {
          set({ error: error.message || 'Failed to fetch system status', loading: false });
        }
      },

      // Action to add a new manhole
      addManhole: async (manhole) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/create`, manhole, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              manholesData: [...state.manholesData, response.data.manhole],
            }));
          } else {
            toast.error(response.data.message || 'Failed to add manhole');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      // Action to update a specific manhole by id
      updateManhole: async (id, updates) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/update/${id}`, updates, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              manholesData: state.manholesData.map((manhole) =>
                manhole.id === id ? { ...manhole, ...updates } : manhole
              ),
            }));
          } else {
            toast.error(response.data.message || 'Failed to update manhole');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      // Action to delete a manhole by id
      deleteManhole: async (id) => {
        try {
          set({ loading: true });
          const response = await axios.delete(`${API_END_POINT}/delete/${id}`);
          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              manholesData: state.manholesData.filter((manhole) => manhole.id !== id),
            }));
          } else {
            toast.error(response.data.message || 'Failed to delete manhole');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      // Action to clear all manholesData from the store (locally, not from the backend)
      clearManholes: () => set({ manholesData: [] }),
    }),
    {
      name: 'manhole-storage', // Key for localStorage persistence
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        manholesData: state.manhole, // Only persist manholesData in localStorage
      }),
    }
  )
);
