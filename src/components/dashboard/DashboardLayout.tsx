"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Music,
  BarChart2,
  Settings,
  DollarSign,
  LogOut,
  HelpCircle,
  User,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ThemeSwitcher } from "../theme-switcher";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const DashboardLayout = ({
  children,
  user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  onLogout = () => {},
}: React.PropsWithChildren<SidebarProps>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/logout", { method: "GET" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems: NavItem[] = [
    {
      label: "Панель управления",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Релизы",
      href: "/dashboard/releases",
      icon: <Music className="h-5 w-5" />,
      badge: "Новый",
    },
    {
      label: "Аналитика",
      href: "/dashboard/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      label: "Платежи",
      href: "/dashboard/payments",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Настройки аккаунта",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-screen bg-background dark:bg-gradient-to-b dark:from-[#0f0720] dark:to-[#090418] overflow-hidden">
      {/* Sidebar - Desktop */}
      <div
        className={`${sidebarCollapsed ? "w-20" : "w-64"} border-r border-border bg-card dark:bg-card/80 dark:backdrop-blur-sm hidden md:flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/" className={sidebarCollapsed ? "mx-auto" : ""}>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Vibrancy
                </span>
              )}
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={`w-full ${isActive(item.href) ? "font-medium" : ""} ${sidebarCollapsed ? "justify-center px-2" : "justify-start"}`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && !sidebarCollapsed && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-1 py-0 text-[10px]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.badge && sidebarCollapsed && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-2 w-2 p-0 rounded-full"
                    />
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div
            className={`mt-4 flex ${sidebarCollapsed ? "justify-center" : "space-x-2"}`}
          >
            {!sidebarCollapsed ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={() => router.push("/dashboard/settings")}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Профиль</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={() => router.push("/support")}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Поддержка</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Выйти</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Выйти</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card shadow-lg p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Vibrancy
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 mb-6 p-3 bg-muted/50 rounded-lg">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`w-full justify-start ${isActive(item.href) ? "font-medium" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      {item.icon}
                      {item.badge && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 px-1 py-0 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-border space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={() => {
                    router.push("/dashboard/settings");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={() => {
                    router.push("/support");
                    setMobileMenuOpen(false);
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  © 2024 Vibrancy Music
                </p>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-border bg-background/95 dark:bg-card/80 backdrop-blur supports-backdrop-blur:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Music className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Vibrancy
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                className="pl-10 w-full bg-muted/40"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-destructive-foreground">
                      3
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Уведомления</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ThemeSwitcher />

            <Avatar className="h-8 w-8 md:hidden">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
