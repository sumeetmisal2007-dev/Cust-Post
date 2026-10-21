"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X, ArrowRight, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/auth-modal";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/setup", label: "Plan setup" },
  { href: "/batches", label: "My batch" },
  { href: "/plants", label: "Learn" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Exchange" },
  { href: "/sources", label: "Sources" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser({
            email: user.email,
            name:
              user.user_metadata?.display_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0],
          });
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    checkUser();

    const handleAuthChange = () => {
      checkUser();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("cust_post_auth_change", handleAuthChange);
      return () => {
        window.removeEventListener("cust_post_auth_change", handleAuthChange);
      };
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      // Ignored
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="max-w-content mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white shadow-sm">
            <Sprout className="h-5 w-5" aria-hidden="true" />
          </div>
          <span>CUST-POST</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-action py-1",
                  isActive ? "text-action font-semibold border-b-2 border-action" : "text-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-ink hover:border-action/40 transition-colors shadow-2xs"
                title="View Profile"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-muted hover:text-ink font-medium px-1.5 py-1 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-sm font-medium text-muted hover:text-ink transition-colors px-2 py-1"
            >
              Sign in
            </button>
          )}

          <Button asChild size="sm">
            <Link href="/setup">
              Start a setup
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden h-11 w-11 items-center justify-center rounded-control border border-border text-ink hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3 rounded-control text-base font-medium text-ink hover:bg-canvas"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between py-2 px-1">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <UserIcon className="h-4 w-4 text-action" />
                  <span>{currentUser.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-xs text-muted hover:text-ink font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center justify-center min-h-[44px] w-full rounded-control border border-border text-sm font-medium text-ink hover:bg-canvas"
              >
                Sign in
              </button>
            )}

            <Button asChild className="w-full">
              <Link href="/setup" onClick={() => setIsMobileMenuOpen(false)}>
                Start a setup
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
