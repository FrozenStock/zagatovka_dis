"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music, User, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AuthButton } from "../auth/AuthButton";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onProfileClick?: () => void;
  onMenuToggle?: () => void;
}

const Navbar = ({
  isAuthenticated = false,
  onLoginClick = () => {},
  onRegisterClick = () => {},
  onProfileClick = () => {},
  onMenuToggle = () => {},
}: NavbarProps) => {
  const router = useRouter();

  return (
    <header className="w-full h-20 bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Vibrancy Music
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Возможности
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Цены
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Блог
          </Link>
          <Link
            href="/support"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Поддержка
          </Link>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onProfileClick}>
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">
                    Панель управления
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/releases" className="w-full">
                    Мои релизы
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/analytics" className="w-full">
                    Аналитика
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout" className="w-full">
                    Выйти
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <AuthButton />
              <Button size="sm" onClick={onRegisterClick}>
                Начать
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
