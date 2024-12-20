import { useRouter } from 'next/router';
import { create } from 'zustand';

interface AuthStore {
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => {
        set({ user: null });
        // Add your logout logic here
    },
}));

export const useAuth = () => {
    const router = useRouter();
    const { user, setUser, logout } = useAuthStore();

    return {
        user,
        setUser,
        logout: async () => {
            await logout();
            router.push('/auth/login');
        },
        isAuthenticated: !!user,
    };
};