import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_TASK_ENDPOINT = `/api/v1/tasks/get-task-overview`; // Adjust to your actual API path

const useTaskStore = create(
  persist(
    (set) => ({

      task: [],
      loading: false,
      error: null,


      // Fetch task overview and list
      fetchTasksOverviewWithList: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(API_TASK_ENDPOINT);
          console.log('Task overview response:', response);
          if (response.data.success) {
      
            set({
              task:response.data.data.tasks, loading: false,
            });
          } else {
            set({ error: 'Failed to load task data', loading: false });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Server error',
            loading: false,
          });
        }
      },

      // Optionally, add more task-related actions here (create, update, delete)
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        task: state.task,
      }),
    }
  )
);

export default useTaskStore;
