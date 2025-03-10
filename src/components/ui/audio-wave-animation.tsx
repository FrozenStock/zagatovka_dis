"use client";

import React, { useEffect, useRef } from "react";

interface AudioWaveAnimationProps {
  className?: string;
  barCount?: number;
  barColor?: string;
  barWidth?: number;
  barGap?: number;
  barHeight?: number;
  animationSpeed?: number;
}

export function AudioWaveAnimation({
  className = "",
  barCount = 20,
  barColor = "rgba(123, 97, 255, 0.7)",
  barWidth = 3,
  barGap = 2,
  barHeight = 40,
  animationSpeed = 1,
}: AudioWaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const totalWidth = barCount * (barWidth + barGap) - barGap;
    canvas.width = totalWidth;
    canvas.height = barHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = barColor;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + barGap);
        // Create a sine wave effect with different phases for each bar
        const height =
          (Math.sin(time * animationSpeed + i * 0.2) + 1) *
          (barHeight / 2) *
          0.8;

        // Draw from the middle
        const y = (barHeight - height) / 2;
        ctx.fillRect(x, y, barWidth, height);
      }

      time += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [barCount, barColor, barWidth, barGap, barHeight, animationSpeed]);

  return <canvas ref={canvasRef} className={className} />;
}
