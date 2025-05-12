import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_END_POINT = 'http://localhost:3000/api/v1/sensors';
axios.defaults.withCredentials = true;
const useSensorsStore = create(
  persist(
    (set) => ({
      manholes: [],
      loading: false,
      error: null,

      fetchManholes: async () => {
        set({ loading: true, error: null });

        try {
          const response = await axios.get(`${API_END_POINT}/get-all-sernsor-readings`); // Adjust API path as needed
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
    }),
    {
      name: 'manhole-storage', // Key in localStorage
      partialize: (state) => ({ manholes: state.manholes }), // Persist only 'manholes' data
    }
  )
);

export default useSensorsStore;
