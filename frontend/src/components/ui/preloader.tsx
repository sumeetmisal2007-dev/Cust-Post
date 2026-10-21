"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sprout, Mail, Key, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface PreloaderProps {
  durationMs?: number;
}

export function Preloader({ durationMs = 1800 }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"animating" | "login">("animating");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [mode, setMode] = useState<"magic_link" | "password">("magic_link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const currentPath = pathname || "/";

  const completeAndDismiss = useCallback(() => {
    setIsExiting(true);
    try {
      sessionStorage.setItem("cust_post_preloader_seen", "true");
    } catch {

    }
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    try {
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then(({ data }) => {
          setIsAuthenticated(!!data?.user?.email);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {

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
    if (!isVisible || isExiting || stage !== "animating") return;

    const intervalTime = 25;
    const steps = durationMs / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(interval);

        if (isAuthenticated) {
          completeAndDismiss();
        } else {
          setStage("login");
        }
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [isVisible, isExiting, stage, durationMs, isAuthenticated, completeAndDismiss]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const supabase = createClient();
      const redirectUri = `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/auth/callback?next=${encodeURIComponent(currentPath)}`;

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
        },
      });

      if (authError) throw authError;

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Signed in with Google!");
      setTimeout(() => {
        completeAndDismiss();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const supabase = createClient();

      if (mode === "magic_link") {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
        });
        if (authError) throw authError;
        setMessage("Magic login link sent! Check your inbox to sign in.");
        setTimeout(() => {
          completeAndDismiss();
        }, 1500);
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        setMessage("Signed in successfully!");
        setTimeout(() => {
          completeAndDismiss();
        }, 1000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Welcome to Cust-Post"
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

      <div className="w-full flex items-center justify-center text-ink/70">
        <span className="text-xs uppercase tracking-widest font-semibold">
          Space-Aware Composting
        </span>
      </div>

      {stage === "animating" ? (
        <>

          <div className="flex flex-col items-center justify-center space-y-6 max-w-sm text-center">

            <div className="relative w-28 h-28 flex items-center justify-center">

              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand/25 to-accent/25 blur-xl animate-amc-glow"
                aria-hidden="true"
              />

              <svg
                className="w-24 h-24 text-brand transform -rotate-12 transition-transform duration-500 hover:rotate-0"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >

                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-amc-stroke text-ink/80"
                />

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

            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                Cust-Post
              </h1>
              <p className="text-sm font-medium text-muted tracking-normal">
                Preparing tailored soil guidance...
              </p>
            </div>
          </div>

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
        </>
      ) : (

        <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-border/80 rounded-panel p-6 sm:p-8 shadow-2xl space-y-5 text-left transition-all duration-500 transform scale-100 opacity-100 my-auto">

          <div className="text-center space-y-1.5 pb-2">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-control bg-brand text-white shadow-sm mb-1">
              <Sprout className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Sign In or Sync Account
            </h2>
            <p className="text-xs text-muted">
              Sync your balcony batches across devices or explore freely.
            </p>
          </div>

          <div className="p-3.5 rounded-card bg-surface-soft/90 border border-border/70 flex items-start gap-2.5 text-xs text-muted leading-relaxed">
            <Sparkles className="h-4 w-4 text-action shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">No account required: </strong>
              You can plan and track compost batches without signing in. Creating an account simply enables multi-device syncing.
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Primary Action: Google Authentication */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-control border border-border/80 bg-white hover:bg-neutral-50 text-xs font-semibold text-ink shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative bg-white/90 px-3 text-[11px] uppercase tracking-wider text-muted font-medium">
              Or continue with email
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="preloader-auth-email"
                className="text-xs font-semibold text-ink flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-action" />
                <span>Email Address</span>
              </label>
              <Input
                id="preloader-auth-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode === "password" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="preloader-auth-password"
                  className="text-xs font-semibold text-ink flex items-center gap-1.5"
                >
                  <Key className="h-3.5 w-3.5 text-action" />
                  <span>Password</span>
                </label>
                <Input
                  id="preloader-auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <div className="pt-1 flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? "Processing..."
                  : mode === "magic_link"
                  ? "Send Magic Link"
                  : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "magic_link" ? "password" : "magic_link");
                  setError(null);
                }}
                className="text-xs text-center text-muted hover:text-ink font-medium transition-colors py-1"
              >
                {mode === "magic_link"
                  ? "Use password instead"
                  : "Use Magic Link (Passwordless) instead"}
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={completeAndDismiss}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-control border border-border bg-canvas hover:bg-white text-xs font-semibold text-ink transition-colors shadow-xs"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-3.5 h-3.5 text-action" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full text-center text-[11px] text-muted/60">
        Cust-Post &bull; Urban Balcony Composting Assistant
      </div>
    </div>
  );
}
