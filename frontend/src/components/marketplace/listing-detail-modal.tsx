"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  MessageCircle,
  Truck,
  Package,
  Calendar,
  Sparkles,
  Clock,
  Shield,
  Tag,
} from "lucide-react";
import { CompostListing, CompostType } from "@cust-post/backend";
import { Button } from "@/components/ui/button";

interface ListingDetailModalProps {
  isOpen: boolean;
  listing: CompostListing | null;
  onClose: () => void;
  onContact: (listing: CompostListing) => void;
  isOwner?: boolean;
}

const COMPOST_TYPE_NAMES: Record<CompostType, string> = {
  vermicompost: "Pure Vermicompost (Worm Castings)",
  kitchen_waste: "Kitchen Waste Aerobic Compost",
  garden_compost: "Seasoned Garden Leaf Mold",
  bokashi: "Fermented Bokashi Pre-Compost",
  other: "Community Handcrafted Compost",
};

const FULFILLMENT_DETAILS = {
  pickup_only: "Local Pickup Only — Buyer collects from general pickup neighborhood",
  delivery_available: "Local Delivery Available — Seller arranges delivery",
  both: "Pickup or Delivery — Flexible local arrangement",
};

export function ListingDetailModal({
  isOpen,
  listing,
  onClose,
  onContact,
  isOwner,
}: ListingDetailModalProps) {
  if (!isOpen || !listing) return null;

  const isSold = listing.status === "sold";
  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs amc-fade-in"
    >
      <div className="relative w-full max-w-xl bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-action" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
              Compost Listing Details
            </span>
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

        {/* Hero image if exists */}
        {listing.imageUrl && (
          <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-border/80 bg-muted/20">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-ink/65 flex items-center justify-center">
                <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-sm font-bold uppercase tracking-wider">
                  Marked as Sold
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="listing-detail-title" className="font-display text-2xl font-extrabold text-ink tracking-tight">
              {listing.title}
            </h2>
            <div className="shrink-0 text-right">
              {listing.isFree ? (
                <span className="text-2xl font-black text-emerald-700 font-display">Free</span>
              ) : (
                <span className="text-2xl font-black text-ink font-display">₹{listing.priceInr}</span>
              )}
            </div>
          </div>

          <p className="text-xs font-mono uppercase tracking-wider text-action font-semibold">
            {COMPOST_TYPE_NAMES[listing.compostType]}
          </p>

          <p className="text-sm text-text/90 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Detailed Spec Grid */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-muted block text-[11px]">Available Quantity</span>
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-action" />
                <span>
                  {listing.quantity} {listing.unit}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted block text-[11px]">General Pickup Area</span>
              <div className="font-bold text-ink flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-action" />
                <span>
                  {listing.locality}, {listing.city}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted block text-[11px]">Maturity / Condition</span>
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand" />
                <span>{listing.conditionMaturity || "Cured and ready for blending"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted block text-[11px]">Fulfillment Strategy</span>
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-action" />
                <span>{listing.fulfillmentType.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 text-[11px] text-muted leading-relaxed">
            {FULFILLMENT_DETAILS[listing.fulfillmentType]}
          </div>
        </div>

        {/* Nirmaan Lab Formulation Specifications */}
        {(listing.title.toLowerCase().includes("cust-post") ||
          listing.sellerDisplayName.toLowerCase().includes("nirmaan") ||
          listing.imageUrl?.includes("cust-post")) && (
          <div className="p-4 rounded-xl border border-emerald-300/80 bg-emerald-50/70 text-xs space-y-2 text-left">
            <div className="flex items-center gap-2 text-emerald-950 font-bold font-display">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>Nirmaan Lab Formulation & Usage Guide</span>
            </div>
            <div className="space-y-1.5 text-emerald-900 text-[11px] leading-relaxed">
              <p>
                <strong>Ingredients:</strong> Cow dung & farm-yard manure (cured), Earthworm castings (Eisenia fetida), Dry leaves & crop residue, Kitchen / vegetable waste (plant-based), Cocopeat for moisture balance. 100% natural, zero chemicals added.
              </p>
              <p>
                <strong>How to Use:</strong> Pots: 1-2 spoons per small pot, mix into topsoil, water well. Repeat monthly. Garden: 1 handful per plant at root zone. Keep in a cool, dry, shaded place.
              </p>
            </div>
          </div>
        )}

        {/* Seller Info & Security Note */}
        <div className="p-3.5 rounded-xl bg-mint/20 border border-mint flex items-start gap-3 text-xs text-text">
          <Shield className="h-4 w-4 text-action shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold text-ink">
              Seller: {listing.sellerDisplayName} • Listed on {formattedDate}
            </div>
            <p className="text-muted text-[11px]">
              Buyers and sellers coordinate collection and payment directly. CUST-POST does not take commission or process financial transactions.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>

          {!isOwner && !isSold && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onContact(listing);
              }}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Contact Seller</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
