"use client";

import React from "react";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { AudioWaveAnimation } from "../ui/audio-wave-animation";
import { motion } from "framer-motion";
import {
  Music,
  Play,
  ArrowRight,
  Headphones,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

interface HeroSectionProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const HeroSection = ({
  onLoginClick = () => {},
  onRegisterClick = () => {},
}: HeroSectionProps) => {
  return (
    <section className="w-full h-[600px] bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      {/* Background animated waveform effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/20 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AudioWaveAnimation
            barCount={40}
            barHeight={80}
            barColor="rgba(123, 97, 255, 0.3)"
          />
        </div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 space-y-6 text-center lg:text-left pt-16 lg:pt-0"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
            Раскройте свой <AnimatedGradientText text="музыкальный потенциал" />
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl animate-slide-in-left">
            Современная платформа для независимых артистов для распространения,
            управления и монетизации своей музыки на всех основных стриминговых
            сервисах.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-slide-in-right">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-base font-semibold">
                  Начать <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <Tabs defaultValue="register">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Вход</TabsTrigger>
                    <TabsTrigger value="register">Регистрация</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm
                      onSubmit={async (data) => {
                        try {
                          const response = await fetch("/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                          });

                          const result = await response.json();

                          if (!response.ok) {
                            throw new Error(result.error || "Ошибка входа");
                          }

                          window.location.href = "/dashboard";
                        } catch (error: any) {
                          alert(error.message || "Произошла ошибка при входе");
                        }
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="register">
                    <RegisterForm
                      onSubmit={(data) => {
                        fetch("/api/auth/register", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: data.name,
                            email: data.email,
                            password: data.password,
                          }),
                        }).then(async (res) => {
                          if (res.ok) {
                            // Show success message and close dialog
                            alert(
                              "Регистрация успешна! Пожалуйста, проверьте вашу электронную почту для подтверждения аккаунта.",
                            );
                            window.location.href = "/login";
                          } else {
                            const data = await res.json();
                            alert(data.error || "Ошибка регистрации");
                          }
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="lg"
              className="text-base font-semibold"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Смотреть демо
            </Button>
          </div>
          <div className="flex items-center justify-center lg:justify-start space-x-8 pt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">100K+ Артистов</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">150+ Стран</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">50+ Платформ</span>
            </div>
          </div>
        </motion.div>

        {/* Right content - Floating album artwork */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-80 h-80 animate-float"
          >
            {/* Main album artwork */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-lg shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white/10 animate-glow">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80"
                alt="Album cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="font-bold text-white">Новый релиз</h3>
                  <p className="text-sm text-gray-300">Ваш следующий хит</p>
                </div>
              </div>
            </div>

            {/* Secondary album artwork */}
            <div className="absolute bottom-0 right-0 w-56 h-56 rounded-lg shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 border-4 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80"
                alt="Album cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="font-bold text-white">Топ-чарты</h3>
                  <p className="text-sm text-gray-300">В тренде сейчас</p>
                </div>
              </div>
            </div>

            {/* Play button overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary shadow-lg"
              >
                <Play className="h-8 w-8 fill-white text-white" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Дистрибуция музыки</h3>
                <p className="text-xs text-gray-400">Все основные платформы</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Расширенная аналитика</h3>
                <p className="text-xs text-gray-400">
                  Отслеживание эффективности
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Выплаты роялти</h3>
                <p className="text-xs text-gray-400">Быстро и прозрачно</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Поддержка артистов</h3>
                <p className="text-xs text-gray-400">Помощь 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
