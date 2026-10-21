"use client";

import React, { useState } from "react";
import { X, MessageCircle, Send, Check, Shield, AlertTriangle } from "lucide-react";
import { CompostListing } from "@cust-post/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactSellerModalProps {
  isOpen: boolean;
  listing: CompostListing | null;
  onClose: () => void;
  onSuccess?: () => void;
  currentUser?: { id: string; email?: string; name?: string } | null;
  onRequireAuth: () => void;
}

export function ContactSellerModal({
  isOpen,
  listing,
  onClose,
  onSuccess,
  currentUser,
  onRequireAuth,
}: ContactSellerModalProps) {
  const [buyerName, setBuyerName] = useState(currentUser?.name || "");
  const [buyerContact, setBuyerContact] = useState(currentUser?.email || "");
  const [message, setMessage] = useState(
    listing
      ? `Hi ${listing.sellerDisplayName}! I am interested in your "${listing.title}" listed in ${listing.locality}, ${listing.city}. Is it still available for ${
          listing.fulfillmentType === "delivery_available" ? "delivery" : "pickup"
        }?`
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!buyerName.trim() || !buyerContact.trim() || !message.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch("/api/marketplace/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: listing.sellerId,
          buyerName: buyerName.trim(),
          buyerContact: buyerContact.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send inquiry";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs amc-fade-in"
    >
      <div className="relative w-full max-w-lg bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-action" />
            <h3 id="contact-modal-title" className="font-display text-lg font-bold text-ink">
              Contact Seller Privately
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

        {/* Listing Summary Card */}
        <div className="p-3.5 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-ink block">{listing.title}</span>
            <span className="text-muted">
              {listing.quantity} {listing.unit} • {listing.locality}, {listing.city}
            </span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-action text-sm">
              {listing.isFree ? "Free" : `₹${listing.priceInr}`}
            </span>
            <span className="text-[10px] text-muted block">By {listing.sellerDisplayName}</span>
          </div>
        </div>

        {/* Privacy Assurance Notice */}
        <div className="p-3 rounded-xl bg-mint/30 border border-mint text-xs text-text flex items-start gap-2">
          <Shield className="h-4 w-4 text-action shrink-0 mt-0.5" />
          <span>
            <strong>Zero Public Contact Details:</strong> Your contact details and message will be delivered privately to {listing.sellerDisplayName} inside their authenticated seller inbox. We never expose phone numbers or exact addresses publicly.
          </span>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-card bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-5 w-5" />
            </div>
            <h4 className="font-display text-base font-bold text-emerald-950">Inquiry Sent Successfully!</h4>
            <p className="text-xs text-emerald-800">
              The seller has been notified privately. They will contact you directly via your provided contact details to arrange pickup.
            </p>
          </div>
        ) : !currentUser ? (
          <div className="p-5 rounded-card border border-border bg-surface text-center space-y-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto" />
            <h4 className="font-display text-base font-bold text-ink">Sign In Required</h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              To prevent spam and keep seller communications private, please sign in or sync your account before contacting neighbors.
            </p>
            <Button
              type="button"
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full"
            >
              Sign In to Message Seller
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="buyer-name" className="text-xs font-semibold text-ink">
                Your Name
              </label>
              <Input
                id="buyer-name"
                required
                placeholder="e.g. Aditi Sharma"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-contact" className="text-xs font-semibold text-ink">
                Your Contact Information (Email or Phone)
              </label>
              <Input
                id="buyer-contact"
                required
                placeholder="e.g. aditi@gmail.com or +91 98765 43210"
                value={buyerContact}
                onChange={(e) => setBuyerContact(e.target.value)}
              />
              <span className="text-[10px] text-muted block">
                The seller will use this information to respond to you privately.
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-message" className="text-xs font-semibold text-ink">
                Message to Seller
              </label>
              <textarea
                id="buyer-message"
                required
                rows={4}
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-action"
                placeholder="Ask about pickup timing, container requirements, or soil advice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                <span>{isSubmitting ? "Sending..." : "Send Private Inquiry"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
