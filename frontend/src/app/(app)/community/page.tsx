"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sprout,
  PlusCircle,
  MapPin,
  Search,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExchangeListing, ExchangeCategory } from "@cust-post/backend";
import { communityService } from "@cust-post/backend";
import { PostListingModal } from "@/components/community/post-listing-modal";
import { PLANT_GUIDES } from "@cust-post/backend";

const CATEGORY_TABS: { val: ExchangeCategory | "all"; label: string }[] = [
  { val: "all", label: "All Items" },
  { val: "surplus_compost", label: "🍃 Surplus Compost" },
  { val: "seeds_cuttings", label: "🌱 Seeds & Cuttings" },
  { val: "browns", label: "📦 Browns & Leaves" },
  { val: "pots_tools", label: "🪴 Pots & Tools" },
];

export default function CommunityExchangePage() {
  const [listings, setListings] = useState<ExchangeListing[]>([]);
  const [activeCategory, setActiveCategory] = useState<ExchangeCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadListings = React.useCallback(async () => {
    try {
      const data = await communityService.getListings(activeCategory, searchQuery);
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const getContactLink = (listing: ExchangeListing) => {
    const handle = listing.contactHandle.replace(/\s+/g, "");
    switch (listing.contactMethod) {
      case "whatsapp":
        const cleanNumber = handle.replace(/[^0-9]/g, "");
        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
          `Hi! I saw your "${listing.title}" on Cust-Post Soil & Seed Circle. Is it still available?`
        )}`;
      case "telegram":
        const cleanUsername = handle.replace("@", "");
        return `https://t.me/${cleanUsername}`;
      case "email":
        return `mailto:${handle}?subject=${encodeURIComponent(
          `Cust-Post Exchange: ${listing.title}`
        )}`;
      case "phone":
        return `tel:${handle}`;
      default:
        return "#";
    }
  };

  const categoryStyles: Record<ExchangeCategory, { label: string; badge: string }> = {
    surplus_compost: {
      label: "Surplus Compost",
      badge: "bg-emerald-100/90 text-emerald-950 border-emerald-300",
    },
    seeds_cuttings: {
      label: "Seeds & Cuttings",
      badge: "bg-amber-100/90 text-amber-950 border-amber-300",
    },
    browns: {
      label: "Browns & Leaves",
      badge: "bg-orange-100/90 text-orange-950 border-orange-300",
    },
    pots_tools: {
      label: "Pots & Tools",
      badge: "bg-sky-100/90 text-sky-950 border-sky-300",
    },
  };

  return (
    <div className="py-8 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 text-left">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-8 amc-stagger-1">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/50 border border-border text-xs font-mono uppercase tracking-wider text-action font-semibold shadow-xs animate-amc-float">
            <Sprout className="h-3.5 w-3.5" />
            <span>Soil & Seed Circle</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Urban Compost & Seed Exchange
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Connect with nearby balcony gardeners across Indian cities. Share surplus cured compost, swap heirloom seed cuttings, source dry carbon browns, and rehome spare containers.
          </p>
        </div>

        <div className="shrink-0">
          <Button onClick={() => setIsModalOpen(true)} size="lg" className="shadow-md amc-button-smooth">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Post a Share Listing</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              type="button"
              key={tab.val}
              onClick={() => setActiveCategory(tab.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap amc-pill-smooth border ${
                activeCategory === tab.val
                  ? "bg-ink text-surface border-ink shadow-xs"
                  : "bg-surface text-muted border-border hover:bg-canvas hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search locality or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-action transition-all duration-300"
          />
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="p-12 rounded-[24px] border border-dashed border-border bg-surface text-center space-y-4 amc-stagger-2 amc-card-smooth">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/50 text-action animate-amc-float">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-display text-lg font-bold text-ink">No exchange listings found</h3>
            <p className="text-xs text-muted">
              {searchQuery
                ? `No listings matching "${searchQuery}". Try broadening your search or clear filters.`
                : "Be the first in your locality to offer surplus compost or cuttings!"}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <Button type="button" variant="secondary" onClick={() => setSearchQuery("")} className="amc-button-smooth">
                Clear Search
              </Button>
            )}
            <Button type="button" onClick={() => setIsModalOpen(true)} className="amc-button-smooth">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Post a Share Listing</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 amc-stagger-2">
          {listings.map((item) => {
            const relatedPlant = item.relatedPlantSlug
              ? PLANT_GUIDES.find((p) => p.slug === item.relatedPlantSlug)
              : null;
            const categoryMeta = categoryStyles[item.category];

            return (
              <div
                key={item.id}
                className="group relative rounded-[22px] border border-border/80 bg-surface/90 backdrop-blur-sm p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between amc-card-smooth"
              >
                <div className="space-y-3.5">

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-semibold ${categoryMeta.badge}`}
                    >
                      {categoryMeta.label}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
                      <MapPin className="h-3.5 w-3.5 text-action shrink-0" />
                      <span>
                        {item.neighborhood}, {item.city}
                      </span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-xl font-bold text-ink tracking-tight group-hover:text-action transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text/80 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {relatedPlant && (
                    <div className="pt-1">
                      <Link
                        href={`/plants/${relatedPlant.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/50 border border-border/80 text-[11px] font-medium text-action hover:text-brand hover:bg-mint/80 transition-colors"
                      >
                        <Sparkles className="h-3 w-3 text-action" />
                        <span>Balcony Guide: {relatedPlant.name}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted capitalize">
                    Via {item.contactMethod}
                  </span>

                  <a
                    href={getContactLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ink text-surface hover:bg-action text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Contact Neighbor</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PostListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
      />
    </div>
  );
}
