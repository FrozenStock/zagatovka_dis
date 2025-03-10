"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  animationType?: "pulse" | "bounce" | "scale" | "shine" | "none";
}

export function AnimatedButton({
  children,
  className,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled = false,
  type = "button",
  fullWidth = false,
  animationType = "scale",
}: AnimatedButtonProps) {
  // Base styles
  const baseStyles =
    "rounded-md font-medium transition-all duration-300 flex items-center justify-center";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline:
      "border border-primary bg-transparent text-foreground hover:bg-primary/10",
    ghost: "bg-transparent text-foreground hover:bg-muted",
  };

  // Animation variants
  const animations = {
    pulse: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    },
    bounce: {
      whileHover: { y: -5 },
      whileTap: { y: 0 },
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    },
    shine: {
      initial: { backgroundPosition: "-100%" },
      whileHover: { backgroundPosition: "200%" },
      transition: { duration: 1.5, repeat: Infinity },
      className:
        "bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:200%_100%]",
    },
    none: {},
  };

  const selectedAnimation = animations[animationType];

  // Shine effect special case
  const shineClass =
    animationType === "shine" ? "relative overflow-hidden" : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        shineClass,
        className,
      )}
      {...selectedAnimation}
    >
      {iconPosition === "left" && icon && <span className="mr-2">{icon}</span>}
      {children}
      {iconPosition === "right" && icon && <span className="ml-2">{icon}</span>}

      {animationType === "shine" && (
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent shine-effect" />
      )}
    </motion.button>
  );
}
