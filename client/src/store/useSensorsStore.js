import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_END_POINT = `/api/v1/sensors`;
// axios.defaults.withCredentials = true;
// fix the error: "Network Error" in axios
const useSensorsStore = create(
  persist(
    (set) => ({
      manholes: [],
      sensorTrends: [], // New state for trends
      loading: false,
      error: null,

      fetchManholes: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_END_POINT}/get-all-sensor-readings`);
          if (response.data.success) {
            set({ manholes: response.data.manholes, loading: false });
          } else {
            set({ error: 'Failed to load manhole data', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Network or server error',
            loading: false,
          });
        }
      },

      fetchSensorTrends: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_END_POINT}/trends`); // Endpoint for trend
          if (response.data.success) {
            set({ sensorTrends: response.data.sensorTrends, loading: false });
          } else {
            set({ error: 'Failed to load trend data', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Network or server error',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'manhole-storage',
      partialize: (state) => ({
        manholes: state.manholes,
        sensorTrends: state.sensorTrends, // Persist trends too
      }),
    }
  )
);

export default useSensorsStore;
