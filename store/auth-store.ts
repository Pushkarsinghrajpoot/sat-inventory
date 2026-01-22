import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";
import { dummyUsers, loginCredentials } from "@/lib/dummy-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const credentials = loginCredentials[email as keyof typeof loginCredentials];
        
        if (credentials && credentials.password === password) {
          const user = dummyUsers.find(u => u.id === credentials.userId);
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: "auth-storage"
    }
  )
);
