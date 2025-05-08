import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
// import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:3000/api/v1/users"
axios.defaults.withCredentials = true;

// type User = {
//     fullnam;
//     emai;
//     contact:number;
//     addres;
//     cit;
//     countr;
//     profilePictur;
//     admin:boolean;
//     isVerified:boolean;
// }

// type UserState = {
//     user: User | null;
//     isAuthenticated: boolean;
//     isCheckingAuth: boolean;
//     loading: boolean;
//     signup: (input:SignupInputState) => Promise<void>;
//     login: (input:LoginInputState) => Promise<void>;
//     verifyEmail: (verificationCode) => Promise<void>;
//     checkAuthentication: () => Promise<void>;
//     logout: () => Promise<void>;
//     forgotPassword: (emai) => Promise<void>; 
//     resetPassword: (toke, newPasswor) => Promise<void>; 
//     updateProfile: (inpu) => Promise<void>; 
// }s

export const useUserStore = create()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    // signup api implementation
    signup: async (input) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) { 
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    login: async (input) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) { 
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    verifyEmail: async (verificationCode) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            toast.success(error.response.data.message);
            set({ loading: false });
        }
    },
    checkAuthentication: async () => {
        try {
            set({ isCheckingAuth: true });
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            if (response.data.success) {
                set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            }
        } catch (error) {
            set({isAuthenticated: false, isCheckingAuth: false });
        }
    },
    logout: async () => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/logout`);
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: null, isAuthenticated: false })
            }
        } catch (erro) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    forgotPassword: async (email) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    resetPassword: async (token, newPassword) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    updateProfile: async (inpu) => {
        try { 
            const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({user:response.data.user, isAuthenticated:true});
            }
        } catch (error) { 
            toast.error(error.response.data.message);
        }
    }
}),
    {
        name: 'user-name',
        storage: createJSONStorage(() => localStorage),
    }
))