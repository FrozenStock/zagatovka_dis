"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ProfileSetupForm from "./ProfileSetupForm";

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
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [showProfile, setShowProfile] = useState<boolean>(showProfileSetup);

  const handleLoginSubmit = (data: any) => {
    console.log("Login submitted:", data);
    // Here you would typically handle authentication
    // For demo purposes, we'll just log the data
  };

  const handleRegisterSubmit = (data: any) => {
    console.log("Registration submitted:", data);
    // After successful registration, show profile setup
    setShowProfile(true);
    setActiveTab("profile");
  };

  const handleProfileSubmit = (data: any) => {
    console.log("Profile setup submitted:", data);
    // Here you would typically save the profile data
    // and then close the modal or redirect
    onOpenChange(false);
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Handle forgot password flow
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
