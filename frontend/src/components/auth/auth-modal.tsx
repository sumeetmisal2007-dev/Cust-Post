"use client";

import React, { useState } from "react";
import { X, Mail, Key, Sparkles, Check, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"magic_link" | "password">("magic_link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      });

      if (authError) throw authError;

      // If live Supabase returned an OAuth redirect URL, browser will redirect
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      // Simulated local session
      setMessage("Signed in with Google successfully!");
      setTimeout(() => {
        onClose();
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        setMessage("Magic login link sent! Check your email inbox to sign in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        setMessage("Signed in successfully!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-md bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-5 text-left my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="auth-modal-title" className="font-display text-lg font-bold text-ink">
              Sign In or Sync Account
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-muted hover:text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guest Reassurance Notice */}
        <div className="p-3.5 rounded-card bg-surface border border-border flex items-start gap-2.5 text-xs text-muted leading-relaxed">
          <Info className="h-4 w-4 text-action shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink">No account required: </strong>
            You can plan and track compost batches without signing in. Creating an account simply enables multi-device syncing.
          </div>
        </div>

        {/* Notifications */}
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
          <div className="relative bg-canvas px-3 text-[11px] uppercase tracking-wider text-muted font-medium">
            Or continue with email
          </div>
        </div>

        {/* Email form (Magic Link or Password) */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-action" />
              <span>Email Address</span>
            </label>
            <Input
              id="auth-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode === "password" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-action" />
                <span>Password</span>
              </label>
              <Input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="pt-1 flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} variant="secondary" className="w-full">
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
              className="text-xs text-center text-muted hover:text-ink font-medium transition-colors py-0.5"
            >
              {mode === "magic_link"
                ? "Use password instead"
                : "Use Magic Link (Passwordless) instead"}
            </button>
          </div>
        </form>

        {/* Guest Footer */}
        <div className="pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-control border border-border bg-surface-soft hover:bg-white text-xs font-semibold text-ink transition-colors shadow-xs"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-3.5 h-3.5 text-action" />
          </button>
        </div>
      </div>
    </div>
  );
}
