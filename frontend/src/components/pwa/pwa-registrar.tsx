"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, Download, X, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegistrar() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {

        })
        .catch(() => {

        });
    }

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnline(false);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <>

      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-950/90 text-amber-100 border border-amber-500/40 backdrop-blur-md shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2"
        >
          <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Offline Mode: Plant guides & local batch journals cached.</span>
        </aside>
      )}

      {showBackOnline && !isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-950/90 text-emerald-100 border border-emerald-500/40 backdrop-blur-md shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2"
        >
          <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Back Online — Connected to network</span>
        </aside>
      )}

      {deferredPrompt && !isInstalled && !bannerDismissed && (
        <aside
          role="region"
          aria-label="PWA install banner"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-3.5 rounded-[18px] bg-ink/95 text-surface border border-white/20 backdrop-blur-md shadow-2xl text-xs max-w-sm animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-2 flex-1">
            <span className="p-1.5 rounded-lg bg-mint/20 text-emerald-300 shrink-0">
              <Download className="h-4 w-4" />
            </span>
            <div className="space-y-0.5">
              <p className="font-semibold text-white leading-tight">Install Cust-Post App</p>
              <p className="text-[11px] text-white/70">Fast offline access on your balcony</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-lg bg-action hover:bg-brand text-white font-semibold text-xs transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss install banner"
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
