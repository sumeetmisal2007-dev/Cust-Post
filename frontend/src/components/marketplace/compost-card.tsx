"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  MessageCircle,
  Truck,
  Package,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  Edit,
  Tag,
} from "lucide-react";
import { CompostListing, CompostType } from "@cust-post/backend";
import { Button } from "@/components/ui/button";

interface CompostCardProps {
  listing: CompostListing;
  isOwner?: boolean;
  onContact: (listing: CompostListing) => void;
  onViewDetails: (listing: CompostListing) => void;
  onEdit?: (listing: CompostListing) => void;
  onMarkSold?: (listing: CompostListing) => void;
}

const COMPOST_TYPE_LABELS: Record<CompostType, { label: string; badge: string }> = {
  vermicompost: {
    label: "Vermicompost",
    badge: "bg-emerald-100/90 text-emerald-950 border-emerald-300",
  },
  kitchen_waste: {
    label: "Kitchen Aerobic",
    badge: "bg-amber-100/90 text-amber-950 border-amber-300",
  },
  garden_compost: {
    label: "Garden Leaf Mold",
    badge: "bg-orange-100/90 text-orange-950 border-orange-300",
  },
  bokashi: {
    label: "Bokashi Bran",
    badge: "bg-purple-100/90 text-purple-950 border-purple-300",
  },
  other: {
    label: "Custom Compost",
    badge: "bg-stone-100/90 text-stone-950 border-stone-300",
  },
};

const FULFILLMENT_LABELS = {
  pickup_only: "Local Pickup Only",
  delivery_available: "Delivery Available",
  both: "Pickup & Delivery",
};

export function CompostCard({
  listing,
  isOwner,
  onContact,
  onViewDetails,
  onEdit,
  onMarkSold,
}: CompostCardProps) {
  const typeMeta = COMPOST_TYPE_LABELS[listing.compostType] || COMPOST_TYPE_LABELS.other;
  const isSold = listing.status === "sold";
  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      data-testid={`listing-card-${listing.id}`}
      className={`group relative rounded-[22px] border border-border/80 bg-surface/90 backdrop-blur-sm p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between amc-card-smooth ${
        isSold ? "opacity-75 bg-canvas/60" : ""
      }`}
    >
      <div className="space-y-3.5">
        {/* Top image if available */}
        {listing.imageUrl ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border/60 bg-muted/20">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isSold && (
              <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                  Sold Out
                </span>
              </div>
            )}
            {listing.isFree && !isSold && (
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wide shadow-sm">
                  FREE
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-24 rounded-xl border border-dashed border-border/80 bg-mint/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-action" />
              <span className="text-xs font-semibold text-ink font-display">
                Community Cured Compost
              </span>
            </div>
            {isSold ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold uppercase">
                Sold
              </span>
            ) : listing.isFree ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                FREE
              </span>
            ) : (
              <span className="text-sm font-bold text-action font-mono">
                ₹{listing.priceInr}
              </span>
            )}
          </div>
        )}

        {/* Badges & Locality Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-semibold ${typeMeta.badge}`}
          >
            {typeMeta.label}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
            <MapPin className="h-3.5 w-3.5 text-action shrink-0" />
            <span>
              {listing.locality}, {listing.city}
            </span>
          </span>
        </div>

        {/* Title & Price Display */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onViewDetails(listing)}
              className="font-display text-lg font-bold text-ink tracking-tight hover:text-action cursor-pointer transition-colors line-clamp-1"
            >
              {listing.title}
            </h3>
            <div className="text-right shrink-0">
              {listing.isFree ? (
                <span className="text-base font-extrabold text-emerald-700 font-display">
                  Free
                </span>
              ) : (
                <span className="text-base font-extrabold text-ink font-display">
                  ₹{listing.priceInr}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-text/80 leading-relaxed line-clamp-2">
            {listing.description}
          </p>
        </div>

        {/* Quantity, Maturity & Fulfillment */}
        <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px] text-muted">
          <div className="flex items-center gap-1.5 truncate">
            <Package className="h-3.5 w-3.5 text-action shrink-0" />
            <span>
              {listing.quantity} {listing.unit} available
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Truck className="h-3.5 w-3.5 text-action shrink-0" />
            <span>{FULFILLMENT_LABELS[listing.fulfillmentType]}</span>
          </div>

          {listing.conditionMaturity && (
            <div className="col-span-2 flex items-center gap-1.5 text-ink/90 font-medium truncate">
              <Clock className="h-3.5 w-3.5 text-brand shrink-0" />
              <span>{listing.conditionMaturity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between gap-2">
        <div className="text-[11px] text-muted">
          <span className="block font-medium text-ink truncate max-w-[120px]">
            {listing.sellerDisplayName}
          </span>
          <span className="text-[10px] text-muted">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              {!isSold && onMarkSold && (
                <button
                  type="button"
                  onClick={() => onMarkSold(listing)}
                  className="px-2.5 py-1.5 rounded-xl border border-border bg-surface text-ink hover:bg-canvas text-xs font-semibold transition-colors"
                >
                  Mark Sold
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(listing)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-ink text-surface hover:bg-action text-xs font-semibold transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              )}
            </>
          ) : isSold ? (
            <button
              type="button"
              disabled
              className="px-3.5 py-1.5 rounded-xl bg-muted/40 text-muted text-xs font-semibold cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onViewDetails(listing)}
                className="text-xs px-2.5 py-1.5 h-auto"
              >
                Details
              </Button>
              <button
                type="button"
                onClick={() => onContact(listing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink text-surface hover:bg-action text-xs font-semibold transition-colors shadow-2xs"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                <span>Contact Seller</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
