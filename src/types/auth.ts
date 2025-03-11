export type TabType = "login" | "register" | "profile";

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileData {
  username: string;
  fullName: string;
  bio?: string;
}