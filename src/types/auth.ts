export type TabType = "login" | "register" | "profile";

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileData {
  artistName: string;
  bio: string;
  profileImage: File | null;
  genre: string;
  socialLinks: {
    spotify: string;
    instagram: string;
    twitter: string;
  };
}