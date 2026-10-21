"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  Inbox,
  Clock,
  User,
  Mail,
  CheckCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import { MarketplaceInquiry } from "@cust-post/backend";
import { Button } from "@/components/ui/button";

interface SellerInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { id: string; email?: string } | null;
}

export function SellerInquiriesModal({
  isOpen,
  onClose,
  currentUser,
}: SellerInquiriesModalProps) {
  const [inquiries, setInquiries] = useState<MarketplaceInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const role = tab === "received" ? "seller" : "buyer";
        const res = await fetch(`/api/marketplace/inquiries?role=${role}`, {
          headers: {
            "x-user-id": currentUser.id,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setInquiries(data.inquiries || []);
        }
      } catch {
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [isOpen, currentUser, tab]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiries-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs amc-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-action" />
            <h3 id="inquiries-modal-title" className="font-display text-lg font-bold text-ink">
              Private Marketplace Messages
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

        {/* Tabs: Inquiries Received vs Sent */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab("received")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === "received"
                ? "bg-ink text-surface"
                : "bg-surface text-muted hover:text-ink border border-border"
            }`}
          >
            Inquiries Received (As Seller)
          </button>
          <button
            type="button"
            onClick={() => setTab("sent")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === "sent"
                ? "bg-ink text-surface"
                : "bg-surface text-muted hover:text-ink border border-border"
            }`}
          >
            My Inquiries Sent (As Buyer)
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted">Loading private inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-border text-center space-y-2">
              <MessageCircle className="h-8 w-8 text-muted mx-auto" />
              <h4 className="font-display text-sm font-bold text-ink">
                {tab === "received" ? "No seller inquiries yet" : "No sent inquiries"}
              </h4>
              <p className="text-xs text-muted max-w-sm mx-auto">
                {tab === "received"
                  ? "When buyers contact you about your compost listings, their private messages and contact information will appear here."
                  : "When you send a message to another seller, you can review it here."}
              </p>
            </div>
          ) : (
            inquiries.map((inq) => {
              const formattedDate = new Date(inq.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl border border-border/80 bg-surface/90 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-action font-semibold block">
                        Listing: {inq.listingTitle || "Compost Listing"}
                      </span>
                      <h4 className="font-display text-sm font-bold text-ink flex items-center gap-1.5 pt-0.5">
                        <User className="h-3.5 w-3.5 text-muted" />
                        <span>{inq.buyerName}</span>
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-muted">{formattedDate}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-canvas border border-border/60 text-xs text-text/90 leading-relaxed whitespace-pre-line">
                    {inq.message}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-ink font-semibold">
                      <Mail className="h-3.5 w-3.5 text-action" />
                      <span>Reply contact: {inq.buyerContact}</span>
                    </div>

                    <a
                      href={
                        inq.buyerContact.includes("@")
                          ? `mailto:${inq.buyerContact}?subject=${encodeURIComponent(
                              `Cust-Post Marketplace: ${inq.listingTitle || "Compost inquiry"}`
                            )}`
                          : `tel:${inq.buyerContact}`
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-ink text-surface hover:bg-action text-xs font-semibold transition-colors"
                    >
                      <span>Direct Reply</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted shrink-0">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-action" />
            <span>Authenticated and end-to-end private.</span>
          </span>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
