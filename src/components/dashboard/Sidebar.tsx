"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music,
  BarChart3,
  Settings,
  Home,
  LogOut,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Главная",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/releases",
      label: "Релизы",
      icon: <Music className="h-5 w-5" />,
    },
    {
      href: "/dashboard/analytics",
      label: "Аналитика",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: "/payment",
      label: "Финансы",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Настройки",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Music className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Vibrancy Music
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2"
            asChild
          >
            <Link href="/support">
              <HelpCircle className="h-4 w-4" />
              Помощь
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
