import { create } from 'zustand';
import { Storage, STORAGE_KEYS } from '../utils/storage';
import { AuthState, RegisteredUser, UserProfile } from '../types/auth';

interface ExtendedAuthState extends AuthState {
  registeredUsers: RegisteredUser[];
  loadRegisteredUsers: () => Promise<void>;
  getDemoCredentials: () => { email: string; password?: string } | null;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoadingSession: true,
  registeredUsers: [],

  loadSession: async () => {
    try {
      set({ isLoadingSession: true });
      const session = await Storage.getItem<UserProfile>(STORAGE_KEYS.USER_SESSION);
      const registered = (await Storage.getItem<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS)) || [];

      if (session) {
        set({
          user: session,
          isAuthenticated: true,
          registeredUsers: registered,
          isLoadingSession: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          registeredUsers: registered,
          isLoadingSession: false,
        });
      }
    } catch (error) {
      console.error('[AuthStore] Error loading session:', error);
      set({ isLoadingSession: false });
    }
  },

  loadRegisteredUsers: async () => {
    const registered = (await Storage.getItem<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS)) || [];
    set({ registeredUsers: registered });
  },

  register: async (userData, password) => {
    try {
      const registered = (await Storage.getItem<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS)) || [];

      // Check if email already registered
      const existingUser = registered.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: RegisteredUser = {
        ...userData,
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        passwordHash: password, // For demonstration, plain password stored in local secure key
        avatarId: 'avatar_1',
      };

      const updatedList = [newUser, ...registered];
      await Storage.setItem(STORAGE_KEYS.REGISTERED_USERS, updatedList);

      // Extract public profile without passwordHash for active session
      const { passwordHash: _, ...publicProfile } = newUser;
      await Storage.setItem(STORAGE_KEYS.USER_SESSION, publicProfile);

      set({
        user: publicProfile,
        isAuthenticated: true,
        registeredUsers: updatedList,
      });

      return { success: true };
    } catch (error) {
      console.error('[AuthStore] Registration failed:', error);
      return { success: false, error: 'Unable to complete registration. Please try again.' };
    }
  },

  login: async (email, password) => {
    try {
      const registered = (await Storage.getItem<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS)) || [];

      const matchedUser = registered.find(
        (u) =>
          u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
          u.passwordHash === password
      );

      if (!matchedUser) {
        return {
          success: false,
          error: 'Invalid email or password. Please check your credentials.',
        };
      }

      const { passwordHash: _, ...publicProfile } = matchedUser;
      await Storage.setItem(STORAGE_KEYS.USER_SESSION, publicProfile);

      set({
        user: publicProfile,
        isAuthenticated: true,
        registeredUsers: registered,
      });

      return { success: true };
    } catch (error) {
      console.error('[AuthStore] Login failed:', error);
      return { success: false, error: 'Login error occurred. Please try again.' };
    }
  },

  updateProfile: async (updatedData: Partial<UserProfile>) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return false;

      const newProfile: UserProfile = {
        ...currentUser,
        ...updatedData,
      };

      // Update active session
      await Storage.setItem(STORAGE_KEYS.USER_SESSION, newProfile);

      // Update in registered users array
      const registered = (await Storage.getItem<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS)) || [];
      const updatedList = registered.map((u) =>
        u.id === currentUser.id ? { ...u, ...updatedData } : u
      );
      await Storage.setItem(STORAGE_KEYS.REGISTERED_USERS, updatedList);

      set({
        user: newProfile,
        registeredUsers: updatedList,
      });

      return true;
    } catch (error) {
      console.error('[AuthStore] Profile update failed:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await Storage.removeItem(STORAGE_KEYS.USER_SESSION);
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('[AuthStore] Logout failed:', error);
    }
  },

  getDemoCredentials: () => {
    const registered = get().registeredUsers;
    if (registered.length > 0) {
      return { email: registered[0].email, password: registered[0].passwordHash };
    }
    return null;
  },
}));
