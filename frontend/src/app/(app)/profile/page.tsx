"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Trash2,
  ArrowLeft,
  Database,
  Lock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { createClient } from "@/lib/supabase/client";
import { batchStorageService } from "@cust-post/backend";
import { CompostBatch } from "@cust-post/backend";

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [batches, setBatches] = useState<CompostBatch[]>([]);
  const [obsCount, setObsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const loadProfileData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        } else {
          setUserEmail(null);
        }

        const userBatches = await batchStorageService.listBatches();
        setBatches(userBatches);

        let totalObs = 0;
        for (const b of userBatches) {
          const obs = await batchStorageService.getObservations(b.id);
          totalObs += obs.length;
        }
        setObsCount(totalObs);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();

    let subscription: { unsubscribe: () => void } | null = null;
    if (typeof supabase.auth?.onAuthStateChange === "function") {
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        } else {
          setUserEmail(null);
        }
      });
      subscription = sub?.data?.subscription ?? null;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleDeleteAllData = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/user/delete", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user data");
      }

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      router.push("/");
    } catch {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 space-y-8 text-left">

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Privacy & Account</span>
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-ink flex items-center gap-2.5">
          <User className="h-7 w-7 text-action" />
          <span>Profile & Privacy Controls</span>
        </h1>
        <p className="text-sm text-muted">
          Manage your account, review data transparently, or wipe all records with 1-click.
        </p>
      </div>

      <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3 amc-card-smooth amc-stagger-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Account Status
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-ink">
              {userEmail ? userEmail : "Guest Mode (Local Browser Storage)"}
            </div>
            <p className="text-xs text-muted">
              {userEmail
                ? "Your batches and records sync safely with your Supabase account."
                : "Your batches are saved locally in this browser. Sign in to enable multi-device sync."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {userEmail ? "Authenticated" : "Anonymous Guest"}
            </span>
            {!userEmail && (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In / Sync
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-4 amc-card-smooth amc-stagger-2">
        <div className="flex items-center gap-2 text-ink font-bold text-sm">
          <Database className="h-4 w-4 text-action" />
          <span>Stored Composting Data Summary</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xs border border-border/80 bg-canvas space-y-1">
            <span className="text-xs text-muted">Compost Batches</span>
            <div className="font-display text-xl font-bold text-ink">
              {loading ? "..." : batches.length}
            </div>
          </div>

          <div className="p-3 rounded-xs border border-border/80 bg-canvas space-y-1">
            <span className="text-xs text-muted">Dated Observations</span>
            <div className="font-display text-xl font-bold text-ink">
              {loading ? "..." : obsCount}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-ink font-bold text-sm">
          <Shield className="h-4 w-4 text-brand" />
          <span>Privacy & Guardrails Commitments</span>
        </div>

        <ul className="space-y-2 text-xs text-text leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-action shrink-0 mt-0.5" />
            <span>
              <strong>Zero GPS Geolocation: </strong> We never request or store your exact coordinates. Space evaluation only uses user-selected location categories (balcony, indoor, terrace).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-action shrink-0 mt-0.5" />
            <span>
              <strong>Zero Third-Party Advertising: </strong> No commercial tracking scripts or data brokering.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-action shrink-0 mt-0.5" />
            <span>
              <strong>Instant Erasure: </strong> You have complete ownership of your data with hard cascade deletion.
            </span>
          </li>
        </ul>
      </div>

      <div className="p-5 rounded-card border border-rose-300 bg-rose-50/50 space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
          <Trash2 className="h-4 w-4 text-rose-600" />
          <span>Hard Data Deletion & Account Wipe</span>
        </div>
        <p className="text-xs text-rose-950 leading-relaxed">
          Permanently delete all your batches, observations, container profiles, and authentication credentials. This action is irreversible.
        </p>

        {showConfirmDelete ? (
          <div className="p-4 rounded-card border border-rose-300 bg-white space-y-3">
            <p className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Are you sure? All batch logs and observations will be permanently purged.</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAllData}
                disabled={isDeleting}
              >
                {isDeleting ? "Wiping..." : "Yes, Permanently Wipe My Data"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowConfirmDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete All My Data</span>
            </Button>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
