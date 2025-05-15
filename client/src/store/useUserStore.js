import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

const API_END_POINT = `/api/v1/auth`;

// axios.defaults.withCredentials = true;

export const useUserStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,

      signup: async (input) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          } else {
            toast.error(response.data.message || 'Signup failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      login: async (input) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          } else {
            toast.error(response.data.message || 'Login failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      verifyEmail: async (verificationCode) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          } else {
            toast.error(response.data.message || 'Verification failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const response = await axios.get(`${API_END_POINT}/check-auth`);
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          } else {
            set({ isAuthenticated: false, isCheckingAuth: false });
          }
        } catch {
          set({ isAuthenticated: false, isCheckingAuth: false });
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/logout`);
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: null, isAuthenticated: false });
          } else {
            toast.error(response.data.message || 'Logout failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
          if (response.data.success) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message || 'Request failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, {
            newPassword,
          });
          if (response.data.success) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message || 'Reset failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (input) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          } else {
            toast.error(response.data.message || 'Update failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          set({ loading: false });
        }
      },
      // ...inside the persist((set, get) => ({ ... })) block:

      getAllUsers: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/get-all-users`);
          if (response.data.success) {
            // Optionally, you can store it in the state (e.g., users list)
            set({ users: response.data.users });
          } else {
            toast.error(response.data.message || 'Failed to fetch users');
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message || 'Something went wrong while fetching users'
          );
        } finally {
          set({ loading: false });
        }
      },

      deleteUser: async (userId) => {
        try {
          set({ loading: true });
          const response = await axios.delete(`${API_END_POINT}/user/${userId}`);
          if (response.data.success) {
            toast.success(response.data.message);
            // Re-fetch users list if needed
            const updatedUsers = (await axios.get(`${API_END_POINT}/users`)).data.users;
            set({ users: updatedUsers });
          } else {
            toast.error(response.data.message || 'Delete failed');
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong while deleting user');
        } finally {
          set({ loading: false });
        }
      },
    }),

    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isCheckingAuth: state.isCheckingAuth,
      }), // omit loading so it’s never persisted:contentReference[oaicite:1]{index=1}
    }
  )
);
