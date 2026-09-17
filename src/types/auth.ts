export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: Gender;
  address: string;
  city: string;
  avatarId?: string;
  createdAt: string;
}

export interface RegisteredUser extends UserProfile {
  passwordHash: string; // Stored securely in local storage
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<UserProfile, 'id' | 'createdAt'>, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}
