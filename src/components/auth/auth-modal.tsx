"use client";

import React, { useState } from "react";
import { X, Mail, Key, Sparkles, Check, Info } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left">
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

        {/* Reassurance Banner */}
        <div className="p-3.5 rounded-card bg-surface border border-border flex items-start gap-2.5 text-xs text-muted leading-relaxed">
          <Info className="h-4 w-4 text-action shrink-0 mt-0.5" />
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="pt-2 flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
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
      </div>
    </div>
  );
}
