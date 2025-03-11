"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ProfileSetupForm from "./ProfileSetupForm";

// Определение типов для форм
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ProfileData {
  username: string;
  fullName: string;
  bio?: string;
}

interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "login" | "register" | "profile";
  showProfileSetup?: boolean;
}

const AuthModal = ({
  open = true,
  onOpenChange = () => {},
  defaultTab = "login",
  showProfileSetup = false,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "profile">(defaultTab);
  const [showProfile, setShowProfile] = useState<boolean>(showProfileSetup);

  const handleLoginSubmit = async (data: LoginData) => {
    try {
      // Здесь должна быть логика аутентификации
      console.log("Login submitted:", data);
      onOpenChange(false);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegisterSubmit = async (data: RegisterData) => {
    try {
      // Здесь должна быть логика регистрации
      console.log("Registration submitted:", data);
      setShowProfile(true);
      setActiveTab("profile");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleProfileSubmit = async (data: ProfileData) => {
    try {
      // Здесь должна быть логика сохранения профиля
      console.log("Profile setup submitted:", data);
      onOpenChange(false);
    } catch (error) {
      console.error("Profile setup error:", error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Здесь должна быть логика восстановления пароля
      console.log("Forgot password clicked");
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "login"
              ? "Вход"
              : activeTab === "register"
              ? "Создать аккаунт"
              : "Заполните профиль"}
          </DialogTitle>
        </DialogHeader>

        {!showProfile ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login" className="mt-0">
              <LoginForm
                onSubmit={handleLoginSubmit}
                onForgotPassword={handleForgotPassword}
              />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm
                onSubmit={handleRegisterSubmit}
                onLoginClick={() => setActiveTab("login")}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6">
            <ProfileSetupForm onSubmit={handleProfileSubmit} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
