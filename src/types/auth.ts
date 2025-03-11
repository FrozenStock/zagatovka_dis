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

export interface SocialLinks {
  spotify: string;
  instagram: string;
  twitter: string;
}

export interface ProfileData {
  artistName: string;
  bio: string;
  profileImage: File | null;
  genre: string;
  socialLinks: SocialLinks;
}