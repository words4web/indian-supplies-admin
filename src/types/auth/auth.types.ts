export interface AuthUser {
  id: string;
  name: string;
  email: string;
  business: string;
  addresses?: any[];
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}
