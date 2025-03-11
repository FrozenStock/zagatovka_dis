"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ProfileSetupForm from "./ProfileSetupForm";
import { LoginData, RegisterData, ProfileFormData, TabType } from "@/types/auth";

interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: TabType;
  showProfileSetup?: boolean;
}

const AuthModal = ({
  open = true,
  onOpenChange = () => {},
  defaultTab = "login",
  showProfileSetup = false,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [showProfile, setShowProfile] = useState<boolean>(showProfileSetup);

  const handleLoginSubmit = async (data: LoginData) => {
    try {
      console.log("Login submitted:", data);
      onOpenChange(false);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegisterSubmit = async (data: RegisterData) => {
    try {
      console.log("Registration submitted:", data);
      setShowProfile(true);
      setActiveTab("profile");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      console.log("Profile setup submitted:", data);
      onOpenChange(false);
    } catch (error) {
      console.error("Profile setup error:", error);
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
            onValueChange={(value: TabType) => setActiveTab(value)}
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
                onForgotPassword={() => {}}
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
