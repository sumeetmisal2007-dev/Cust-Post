"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/auth-modal";

const NAV_LINKS = [
  { href: "/setup", label: "Plan setup" },
  { href: "/batches", label: "My batch" },
  { href: "/plants", label: "Learn" },
  { href: "/community", label: "Exchange" },
  { href: "/sources", label: "Sources" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-content mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white shadow-sm">
            <Sprout className="h-5 w-5" aria-hidden="true" />
          </div>
          <span>CUST-POST</span>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* CTA Button Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="text-sm font-medium text-muted hover:text-ink transition-colors px-2 py-1"
          >
            Sign in
          </button>
          <Button asChild size="sm">
            <Link href="/setup">
              Start a setup
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
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

      {/* Mobile Dropdown Drawer */}
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
          <div className="pt-2 border-t border-border space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="flex items-center justify-between w-full min-h-[44px] px-3 rounded-control text-base font-medium text-ink hover:bg-canvas"
            >
              <span>Sign in / Sync</span>
              <ArrowRight className="h-4 w-4 text-action" />
            </button>
            <Button asChild className="w-full">
              <Link href="/setup" onClick={() => setIsMobileMenuOpen(false)}>
                Start a setup
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
