"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

interface PreloaderProps {
  durationMs?: number;
}

export function Preloader({ durationMs = 1800 }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  let currentPath = "/";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    currentPath = usePathname() || "/";
  } catch {
    currentPath = "/";
  }

  const completeAndDismiss = useCallback(() => {
    setIsExiting(true);
    try {
      sessionStorage.setItem("cust_post_preloader_seen", "true");
    } catch {
      // Ignore storage errors in restricted contexts
    }
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only display on home page arrival, bypass on subpages or automated test runners
    if (typeof window !== "undefined") {
      if (currentPath !== "/" || window.navigator?.webdriver) {
        setIsVisible(false);
        return;
      }

      const prefersReducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;

      const hasSeen = sessionStorage.getItem("cust_post_preloader_seen") === "true";

      if (prefersReducedMotion || hasSeen) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);
    }
  }, [currentPath]);

  useEffect(() => {
    if (!isVisible || isExiting) return;

    const intervalTime = 25;
    const steps = durationMs / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        completeAndDismiss();
      }
    }, intervalTime);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearInterval(interval);
        completeAndDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, isExiting, durationMs, completeAndDismiss]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Cust-Post application"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 transition-all duration-700 pointer-events-auto ${
        isExiting
          ? "opacity-0 -translate-y-6 scale-[0.98] pointer-events-none"
          : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 20% 30%, rgba(0, 151, 117, 0.45) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(246, 183, 62, 0.45) 0%, transparent 55%), radial-gradient(circle at 50% 50%, #E4F0E8 0%, #F8F3E9 100%)",
        backgroundColor: "#F8F3E9",
      }}
    >
      {/* Top Bar with Brand Micro-Tag and Skip Button */}
      <div className="w-full flex items-center justify-between text-ink/70">
        <span className="text-xs uppercase tracking-widest font-semibold">
          Space-Aware Composting
        </span>
        <button
          type="button"
          onClick={completeAndDismiss}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-ink/20 hover:border-ink/50 bg-white/40 hover:bg-white/80 transition-all text-ink tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand"
        >
          Skip (Esc)
        </button>
      </div>

      {/* Center Emblem and Typography */}
      <div className="flex flex-col items-center justify-center space-y-6 max-w-sm text-center">
        {/* Organic Breathing Emblem */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Subtle glowing halo */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand/25 to-accent/25 blur-xl animate-amc-glow"
            aria-hidden="true"
          />

          {/* AMC-Inspired Vector Stroke SVG */}
          <svg
            className="w-24 h-24 text-brand transform -rotate-12 transition-transform duration-500 hover:rotate-0"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer Organic Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-amc-stroke text-ink/80"
            />
            {/* Sprouting Seedling & Compost Arc */}
            <path
              d="M50 80 C 50 55, 30 45, 25 32 C 38 32, 50 42, 50 55 C 50 42, 62 32, 75 32 C 70 45, 50 55, 50 80 Z"
              stroke="#009775"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="animate-amc-stroke"
            />
            <path
              d="M50 45 L50 20 C 50 14, 56 12, 60 16 C 60 22, 54 26, 50 28"
              stroke="#F6B73E"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-amc-stroke"
            />
          </svg>
        </div>

        {/* Brand Headline */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Cust-Post
          </h1>
          <p className="text-sm font-medium text-muted tracking-normal">
            Preparing tailored soil guidance...
          </p>
        </div>
      </div>

      {/* Bottom Progress Counter */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-2">
        <div className="w-full bg-ink/10 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex justify-between text-xs font-mono text-muted">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
