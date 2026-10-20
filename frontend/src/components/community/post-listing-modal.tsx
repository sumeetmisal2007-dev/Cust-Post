"use client";

import React, { useState } from "react";
import { X, PlusCircle, Sprout, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExchangeCategory } from "@cust-post/backend";
import { communityService } from "@cust-post/backend";
import { PLANT_GUIDES } from "@cust-post/backend";

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PostListingModal({ isOpen, onClose, onSuccess }: PostListingModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExchangeCategory>("surplus_compost");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "telegram" | "email" | "phone">("whatsapp");
  const [contactHandle, setContactHandle] = useState("");
  const [relatedPlantSlug, setRelatedPlantSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !neighborhood.trim() || !city.trim() || !contactHandle.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await communityService.createListing({
        title: title.trim(),
        category,
        description: description.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        contactMethod,
        contactHandle: contactHandle.trim(),
        relatedPlantSlug: relatedPlantSlug || undefined,
      });

      onSuccess();
      onClose();
    } catch {
      setError("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-listing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-action" />
            <h3 id="post-listing-title" className="font-display text-lg font-bold text-ink">
              Share Compost, Seeds & Browns
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

        {error && (
          <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">What are you offering?</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "surplus_compost", label: "🍃 Surplus Compost" },
                { val: "seeds_cuttings", label: "🌱 Seeds & Cuttings" },
                { val: "browns", label: "📦 Browns & Leaves" },
                { val: "pots_tools", label: "🪴 Pots & Tools" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setCategory(opt.val as ExchangeCategory)}
                  className={`p-2.5 rounded-card border text-xs font-medium text-left transition-all ${
                    category === opt.val
                      ? "border-action bg-action/10 text-action font-semibold shadow-2xs"
                      : "border-border bg-surface text-text hover:bg-canvas"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Listing Headline *</label>
            <Input
              type="text"
              placeholder="e.g. 5L Cured Aerobic Compost ready for balcony mix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Neighborhood & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Neighborhood / Locality *</label>
              <Input
                type="text"
                placeholder="e.g. Indiranagar, Bandra West"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">City *</label>
              <Input
                type="text"
                placeholder="e.g. Bengaluru, Mumbai, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Optional: Related Plant Guide */}
          {category === "seeds_cuttings" && (
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Link to Plant Guide (Optional)
              </label>
              <select
                value={relatedPlantSlug}
                onChange={(e) => setRelatedPlantSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
              >
                <option value="">None / Other variety</option>
                {PLANT_GUIDES.map((plant) => (
                  <option key={plant.slug} value={plant.slug}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Details & Pickup Info</label>
            <textarea
              rows={3}
              placeholder="Describe condition, quantity, whether recipient needs to bring their own bag/container, best pickup hours..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            />
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-action" />
              <span>How should neighbors contact you? *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as "whatsapp" | "telegram" | "email" | "phone")}
                className="px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="email">Email</option>
                <option value="phone">Phone / SMS</option>
              </select>
              <Input
                type="text"
                placeholder={
                  contactMethod === "whatsapp" || contactMethod === "phone"
                    ? "+91 98..."
                    : contactMethod === "telegram"
                    ? "@username"
                    : "you@email.com"
                }
                value={contactHandle}
                onChange={(e) => setContactHandle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post to Exchange"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
