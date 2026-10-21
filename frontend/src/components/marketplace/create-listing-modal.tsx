"use client";

import React, { useState } from "react";
import {
  X,
  PlusCircle,
  AlertTriangle,
  Check,
  Tag,
  Package,
  MapPin,
  Clock,
  Truck,
  Image as ImageIcon,
} from "lucide-react";
import {
  createCompostListingSchema,
  CompostType,
  FulfillmentType,
} from "@cust-post/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser?: { id: string; email?: string; name?: string } | null;
  onRequireAuth: () => void;
}

export function CreateListingModal({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  onRequireAuth,
}: CreateListingModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [compostType, setCompostType] = useState<CompostType>("vermicompost");
  const [isFree, setIsFree] = useState(false);
  const [priceInr, setPriceInr] = useState("150");
  const [quantity, setQuantity] = useState("5");
  const [unit, setUnit] = useState<"kg" | "bags" | "litres">("kg");
  const [conditionMaturity, setConditionMaturity] = useState("Fully cured (60+ days), dark crumbly humus");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("both");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setErrors({});
    setGlobalError(null);

    const rawInput = {
      title,
      description,
      compostType,
      isFree,
      priceInr: isFree ? 0 : Number(priceInr),
      quantity: Number(quantity),
      unit,
      conditionMaturity: conditionMaturity.trim() || undefined,
      locality,
      city,
      fulfillmentType,
      imageUrl: imageUrl.trim() || undefined,
    };

    const validation = createCompostListingSchema.safeParse(rawInput);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
          "x-user-name": currentUser.name || currentUser.email?.split("@")[0] || "Urban Gardener",
        },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setGlobalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-listing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs amc-fade-in"
    >
      <div className="relative w-full max-w-xl bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-action" />
            <h3 id="create-listing-title" className="font-display text-lg font-bold text-ink">
              Post a Compost Listing
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

        {!currentUser ? (
          <div className="p-6 rounded-card border border-border bg-surface text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-ink">Sign In Required</h4>
              <p className="text-xs text-muted max-w-sm mx-auto">
                To manage listings, mark items as sold, and receive inquiries securely, please sign in first.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full sm:w-auto"
            >
              Sign In to Post Listing
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {globalError && (
              <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {globalError}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="listing-title" className="text-xs font-semibold text-ink">
                Listing Title *
              </label>
              <Input
                id="listing-title"
                required
                placeholder="e.g. 5kg Pure Vermicompost Worm Castings"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.title[0]}</p>
              )}
            </div>

            {/* Compost Type & Free Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="compost-type" className="text-xs font-semibold text-ink">
                  Compost Type *
                </label>
                <select
                  id="compost-type"
                  value={compostType}
                  onChange={(e) => setCompostType(e.target.value as CompostType)}
                  className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-action"
                >
                  <option value="vermicompost">Vermicompost (Worm Castings)</option>
                  <option value="kitchen_waste">Kitchen Waste Aerobic</option>
                  <option value="garden_compost">Garden Leaf Mold</option>
                  <option value="bokashi">Bokashi Pre-compost</option>
                  <option value="other">Other Compost Blend</option>
                </select>
                {errors.compostType && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.compostType[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="price-inr" className="text-xs font-semibold text-ink">
                    Price (INR ₹) *
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-action font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="rounded border-border text-action focus:ring-action"
                    />
                    <span>Free Community Share</span>
                  </label>
                </div>
                <Input
                  id="price-inr"
                  type="number"
                  disabled={isFree}
                  min={0}
                  step={5}
                  value={isFree ? 0 : priceInr}
                  onChange={(e) => setPriceInr(e.target.value)}
                  placeholder="₹"
                />
                {errors.priceInr && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.priceInr[0]}</p>
                )}
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="quantity" className="text-xs font-semibold text-ink">
                  Available Quantity *
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={0.5}
                  step={0.5}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.quantity[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="unit" className="text-xs font-semibold text-ink">
                  Unit *
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "kg" | "bags" | "litres")}
                  className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-action"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="bags">Bags / Sacks</option>
                  <option value="litres">Litres (L)</option>
                </select>
                {errors.unit && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.unit[0]}</p>
                )}
              </div>
            </div>

            {/* Maturity & Condition Info */}
            <div className="space-y-1">
              <label htmlFor="condition" className="text-xs font-semibold text-ink">
                Maturity or Condition Information
              </label>
              <Input
                id="condition"
                placeholder="e.g. Fully cured for 60 days, dark crumbly texture, double sifted"
                value={conditionMaturity}
                onChange={(e) => setConditionMaturity(e.target.value)}
              />
              {errors.conditionMaturity && (
                <p className="text-[11px] text-rose-600 font-medium">
                  {errors.conditionMaturity[0]}
                </p>
              )}
            </div>

            {/* General Pickup Locality & City (Zero GPS requirement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="locality" className="text-xs font-semibold text-ink">
                  General Pickup Area / Neighborhood *
                </label>
                <Input
                  id="locality"
                  required
                  placeholder="e.g. Koramangala 4th Block"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
                <span className="text-[10px] text-muted block">No GPS coordinates required.</span>
                {errors.locality && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.locality[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="city" className="text-xs font-semibold text-ink">
                  City *
                </label>
                <Input
                  id="city"
                  required
                  placeholder="e.g. Bengaluru, Pune, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.city && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.city[0]}</p>
                )}
              </div>
            </div>

            {/* Fulfillment Strategy */}
            <div className="space-y-1">
              <label htmlFor="fulfillment" className="text-xs font-semibold text-ink">
                Fulfillment Availability *
              </label>
              <select
                id="fulfillment"
                value={fulfillmentType}
                onChange={(e) => setFulfillmentType(e.target.value as FulfillmentType)}
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-action"
              >
                <option value="pickup_only">Local Pickup Only (Buyer collects)</option>
                <option value="delivery_available">Local Delivery Available</option>
                <option value="both">Both Pickup & Local Delivery Available</option>
              </select>
              {errors.fulfillmentType && (
                <p className="text-[11px] text-rose-600 font-medium">
                  {errors.fulfillmentType[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-semibold text-ink">
                Description & Usage Recommendations *
              </label>
              <textarea
                id="description"
                rows={3}
                required
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-action"
                placeholder="Mention inputs used, curing time, texture, or recommended potting ratios..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.description[0]}</p>
              )}
            </div>

            {/* Optional Image URL */}
            <div className="space-y-1">
              <label htmlFor="image-url" className="text-xs font-semibold text-ink">
                Product Image URL (Optional)
              </label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {errors.imageUrl && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.imageUrl[0]}</p>
              )}
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Compost Listing"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
