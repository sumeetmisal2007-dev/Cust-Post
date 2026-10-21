"use client";

import React, { useState } from "react";
import {
  X,
  Edit,
  Trash2,
  CheckCircle,
  Tag,
  Package,
  MapPin,
  Clock,
  Truck,
} from "lucide-react";
import {
  updateCompostListingSchema,
  CompostListing,
  CompostType,
  FulfillmentType,
  ListingStatus,
} from "@cust-post/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditListingModalProps {
  isOpen: boolean;
  listing: CompostListing | null;
  onClose: () => void;
  onSuccess: () => void;
  currentUser?: { id: string; email?: string } | null;
}

export function EditListingModal({
  isOpen,
  listing,
  onClose,
  onSuccess,
  currentUser,
}: EditListingModalProps) {
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [compostType, setCompostType] = useState<CompostType>(
    listing?.compostType || "vermicompost"
  );
  const [isFree, setIsFree] = useState(listing?.isFree || false);
  const [priceInr, setPriceInr] = useState(listing?.priceInr.toString() || "0");
  const [quantity, setQuantity] = useState(listing?.quantity.toString() || "1");
  const [unit, setUnit] = useState<"kg" | "bags" | "litres">(listing?.unit || "kg");
  const [conditionMaturity, setConditionMaturity] = useState(
    listing?.conditionMaturity || ""
  );
  const [locality, setLocality] = useState(listing?.locality || "");
  const [city, setCity] = useState(listing?.city || "");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    listing?.fulfillmentType || "both"
  );
  const [status, setStatus] = useState<ListingStatus>(listing?.status || "active");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        compostType,
        isFree,
        priceInr: isFree ? 0 : Number(priceInr),
        quantity: Number(quantity),
        unit,
        conditionMaturity: conditionMaturity.trim() || undefined,
        locality: locality.trim(),
        city: city.trim(),
        fulfillmentType,
        status,
      };

      const res = await fetch(`/api/marketplace/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update listing");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure you want to remove this listing?")) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/marketplace/listings/${listing.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUser.id,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to remove listing");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Removal failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-listing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs amc-fade-in"
    >
      <div className="relative w-full max-w-xl bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-action" />
            <h3 id="edit-listing-title" className="font-display text-lg font-bold text-ink">
              Edit Compost Listing
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

        <form onSubmit={handleUpdate} className="space-y-4">
          {error && (
            <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Status selector */}
          <div className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-ink block">Listing Status</span>
              <span className="text-[11px] text-muted">
                Mark as sold when inventory is claimed by neighbors
              </span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="rounded-control border border-border bg-canvas px-3 py-1.5 text-xs text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-action"
            >
              <option value="active">Active (Available)</option>
              <option value="sold">Sold Out</option>
              <option value="removed">Removed (Hidden)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-title" className="text-xs font-semibold text-ink">
              Listing Title
            </label>
            <Input
              id="edit-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-price" className="text-xs font-semibold text-ink">
                Price (INR ₹)
              </label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                value={isFree ? 0 : priceInr}
                disabled={isFree}
                onChange={(e) => setPriceInr(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-qty" className="text-xs font-semibold text-ink">
                Quantity ({unit})
              </label>
              <Input
                id="edit-qty"
                type="number"
                min={0.5}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-condition" className="text-xs font-semibold text-ink">
              Condition & Maturity
            </label>
            <Input
              id="edit-condition"
              value={conditionMaturity}
              onChange={(e) => setConditionMaturity(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-desc" className="text-xs font-semibold text-ink">
              Description
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-action"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              <span>Remove Listing</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
