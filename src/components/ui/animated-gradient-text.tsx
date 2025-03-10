"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  fromColor?: string;
  toColor?: string;
  animationDuration?: number;
}

export function AnimatedGradientText({
  text,
  className,
  fromColor = "from-purple-500",
  toColor = "to-blue-500",
  animationDuration = 3,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        `bg-gradient-to-r ${fromColor} ${toColor} bg-clip-text text-transparent inline-block`,
        className,
      )}
      style={{
        backgroundSize: "200% 200%",
        animation: `gradient-animation ${animationDuration}s ease infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </span>
  );
}
