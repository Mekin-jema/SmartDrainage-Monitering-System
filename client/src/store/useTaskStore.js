import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_TASK_ENDPOINT = `/api/v1/tasks/get-task-overview`;
const API_CREATE_TASK_ENDPOINT = `/api/v1/tasks/create-task`; // Adjust to match your backend route

const useTaskStore = create(
  persist(
    (set, get) => ({
      task: [],
      loading: false,
      error: null,

      // Fetch task overview and list
      fetchTasksOverviewWithList: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(API_TASK_ENDPOINT);
          if (response.data.success) {
            set({ task: response.data.data.tasks, loading: false });
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

      // ✅ Create a new task
      createTask: async (taskData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(API_CREATE_TASK_ENDPOINT, taskData);
          if (response.data.success) {
            // Optional: add the new task to the existing state
            set((state) => ({
              task: [...state.task, response.data.data],
              loading: false,
            }));
            return { success: true, message: response.data.message };
          } else {
            set({ error: response.data.message, loading: false });
            return { success: false, message: response.data.message };
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Error creating task';
          set({ error: errorMsg, loading: false });
          return { success: false, message: errorMsg };
        }
      },
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
