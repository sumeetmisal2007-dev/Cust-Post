"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Sprout,
  PlusCircle,
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Inbox,
  ShieldCheck,
  CheckCircle,
  Layers,
  ArrowRight,
  RefreshCw,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CompostListing,
  CompostType,
  ExternalSeedProduct,
  SeedCategory,
} from "@cust-post/backend";
import { createClient } from "@/lib/supabase/client";
import { CompostCard } from "@/components/marketplace/compost-card";
import { SeedCard } from "@/components/marketplace/seed-card";
import { CreateListingModal } from "@/components/marketplace/create-listing-modal";
import { EditListingModal } from "@/components/marketplace/edit-listing-modal";
import { ListingDetailModal } from "@/components/marketplace/listing-detail-modal";
import { ContactSellerModal } from "@/components/marketplace/contact-seller-modal";
import { SellerInquiriesModal } from "@/components/marketplace/seller-inquiries-modal";
import { AuthModal } from "@/components/auth/auth-modal";

const COMPOST_TABS: { val: CompostType | "all"; label: string }[] = [
  { val: "all", label: "All Compost" },
  { val: "vermicompost", label: "🪱 Vermicompost" },
  { val: "kitchen_waste", label: "🥗 Kitchen Aerobic" },
  { val: "garden_compost", label: "🍂 Leaf Mold" },
  { val: "bokashi", label: "🌾 Bokashi Bran" },
];

const SEED_TABS: { val: SeedCategory | "all"; label: string }[] = [
  { val: "all", label: "All Seeds" },
  { val: "vegetable", label: "🥕 Vegetables" },
  { val: "fruit", label: "🍓 Fruits" },
  { val: "herb", label: "🌿 Culinary Herbs" },
  { val: "flower", label: "🌸 Flowers & Pollinators" },
];

export default function MarketplacePage() {
  const [activeSection, setActiveSection] = useState<"compost" | "seeds">("compost");

  // Auth state
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Compost section state
  const [compostListings, setCompostListings] = useState<CompostListing[]>([]);
  const [compostTypeFilter, setCompostTypeFilter] = useState<CompostType | "all">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<"all" | "pickup_only" | "delivery_available">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [compostSearchQuery, setCompostSearchQuery] = useState("");
  const [compostLoading, setCompostLoading] = useState(true);
  const [viewMyListingsOnly, setViewMyListingsOnly] = useState(false);

  // Seeds section state
  const [seedProducts, setSeedProducts] = useState<ExternalSeedProduct[]>([]);
  const [seedCategoryFilter, setSeedCategoryFilter] = useState<SeedCategory | "all">("all");
  const [seedSearchQuery, setSeedSearchQuery] = useState("");
  const [seedsLoading, setSeedsLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<CompostListing | null>(null);
  const [detailListing, setDetailListing] = useState<CompostListing | null>(null);
  const [contactListing, setContactListing] = useState<CompostListing | null>(null);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);

  // Load authenticated user
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.display_name || user.email?.split("@")[0],
          });
        } else {
          setCurrentUser(null);
        }
      } catch {
        // Guest mode fallback
      }
    };

    checkUser();

    let subscription: { unsubscribe: () => void } | null = null;
    if (typeof supabase.auth?.onAuthStateChange === "function") {
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.display_name || session.user.email?.split("@")[0],
          });
        } else {
          setCurrentUser(null);
        }
      });
      subscription = sub?.data?.subscription ?? null;
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cust_post_auth_change", checkUser);
      return () => {
        subscription?.unsubscribe();
        window.removeEventListener("cust_post_auth_change", checkUser);
      };
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch compost listings
  const fetchCompostListings = useCallback(async () => {
    try {
      setCompostLoading(true);
      const params = new URLSearchParams();
      if (compostTypeFilter !== "all") params.set("compostType", compostTypeFilter);
      if (priceFilter !== "all") params.set("priceFilter", priceFilter);
      if (fulfillmentFilter !== "all") params.set("fulfillmentType", fulfillmentFilter);
      if (compostSearchQuery.trim()) params.set("query", compostSearchQuery.trim());
      if (viewMyListingsOnly && currentUser) {
        params.set("sellerId", currentUser.id);
        params.set("status", "all");
      }

      const res = await fetch(`/api/marketplace/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCompostListings(data.listings || []);
      }
    } catch {
      // Graceful error state
    } finally {
      setCompostLoading(false);
    }
  }, [compostTypeFilter, priceFilter, fulfillmentFilter, compostSearchQuery, viewMyListingsOnly, currentUser]);

  useEffect(() => {
    fetchCompostListings();
  }, [fetchCompostListings]);

  // Fetch seeds products
  const fetchSeeds = useCallback(async () => {
    try {
      setSeedsLoading(true);
      const params = new URLSearchParams();
      if (seedCategoryFilter !== "all") params.set("category", seedCategoryFilter);
      if (seedSearchQuery.trim()) params.set("query", seedSearchQuery.trim());

      const res = await fetch(`/api/marketplace/seeds?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSeedProducts(data.products || []);
      }
    } catch {
      // Graceful error state
    } finally {
      setSeedsLoading(false);
    }
  }, [seedCategoryFilter, seedSearchQuery]);

  useEffect(() => {
    fetchSeeds();
  }, [fetchSeeds]);

  // Handle Mark Sold quick action
  const handleMarkSold = async (listing: CompostListing) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/marketplace/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
        body: JSON.stringify({ status: "sold" }),
      });
      if (res.ok) {
        fetchCompostListings();
      }
    } catch {
      // Error
    }
  };

  // Sort compost listings
  const sortedCompostListings = useMemo(() => {
    const items = [...compostListings];
    if (sortBy === "price_asc") {
      return items.sort((a, b) => a.priceInr - b.priceInr);
    }
    if (sortBy === "price_desc") {
      return items.sort((a, b) => b.priceInr - a.priceInr);
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [compostListings, sortBy]);

  return (
    <div className="py-8 sm:py-14 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-8 amc-stagger-1">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/50 border border-border text-xs font-mono uppercase tracking-wider text-action font-semibold shadow-xs animate-amc-float">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Community Marketplace & Stores</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Compost Marketplace & External Seed Store
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Source cured compost and soil amendments from nearby gardeners, or browse curated seed cultivars from verified Indian online gardening stores.
          </p>
        </div>

        {/* Section Switches and Primary Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {currentUser && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsInquiriesModalOpen(true)}
              className="amc-button-smooth"
            >
              <Inbox className="mr-2 h-4 w-4 text-action" />
              <span>My Messages</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="shadow-md amc-button-smooth"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Post a Compost Listing</span>
          </Button>
        </div>
      </div>

      {/* Main Section Navigation Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-1 gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("compost")}
            className={`px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all flex items-center gap-2 ${
              activeSection === "compost"
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <Sprout className="h-4 w-4 text-emerald-400" />
            <span>1. Compost Marketplace</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20">
              {compostListings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("seeds")}
            className={`px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all flex items-center gap-2 ${
              activeSection === "seeds"
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span>2. Seeds from Online Stores</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20">
              {seedProducts.length}
            </span>
          </button>
        </div>

        {currentUser ? (
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Signed in as <strong>{currentUser.name}</strong></span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-action font-semibold hover:underline"
          >
            <span>Sign in to manage listings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* SECTION 1: COMPOST MARKETPLACE */}
      {activeSection === "compost" && (
        <div className="space-y-6 amc-fade-in">
          {/* Filter Bar */}
          <div className="space-y-4 bg-surface/60 p-4 rounded-2xl border border-border/80">
            {/* Top row: Search, Sort & My Listings filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search compost by title, locality (e.g. Indiranagar), or city..."
                  value={compostSearchQuery}
                  onChange={(e) => setCompostSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-action transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-action"
                  aria-label="Sort listings"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>

                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setViewMyListingsOnly(!viewMyListingsOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      viewMyListingsOnly
                        ? "bg-action text-white border-action"
                        : "bg-surface text-ink border-border hover:bg-canvas"
                    }`}
                  >
                    My Listings Only
                  </button>
                )}
              </div>
            </div>

            {/* Bottom row: Type Tabs, Price & Fulfillment Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2 border-t border-border/50">
              {/* Compost Type Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full md:w-auto">
                {COMPOST_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.val}
                    onClick={() => setCompostTypeFilter(tab.val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                      compostTypeFilter === tab.val
                        ? "bg-ink text-surface border-ink shadow-2xs"
                        : "bg-surface text-muted border-border hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Price & Fulfillment Selectors */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted hover:text-ink"
                  aria-label="Filter by price"
                >
                  <option value="all">Price: All</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Listings</option>
                </select>

                <select
                  value={fulfillmentFilter}
                  onChange={(e) => setFulfillmentFilter(e.target.value as any)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted hover:text-ink"
                  aria-label="Filter by fulfillment"
                >
                  <option value="all">Fulfillment: All</option>
                  <option value="pickup_only">Pickup Only</option>
                  <option value="delivery_available">Delivery Available</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {compostLoading ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw className="h-6 w-6 text-action animate-spin mx-auto" />
              <p className="text-xs text-muted">Loading neighborhood compost listings...</p>
            </div>
          ) : sortedCompostListings.length === 0 ? (
            <div className="p-12 rounded-[24px] border border-dashed border-border bg-surface text-center space-y-4 amc-stagger-2 amc-card-smooth">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/50 text-action animate-amc-float">
                <Sprout className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-display text-lg font-bold text-ink">
                  {viewMyListingsOnly ? "You haven't posted any listings yet" : "No compost listings found"}
                </h3>
                <p className="text-xs text-muted">
                  {compostSearchQuery || compostTypeFilter !== "all" || priceFilter !== "all"
                    ? "Try clearing filters to see more results."
                    : "Have extra compost from your finished bin? Be the first to list it for nearby balcony gardeners."}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                {(compostSearchQuery || compostTypeFilter !== "all" || priceFilter !== "all") && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setCompostSearchQuery("");
                      setCompostTypeFilter("all");
                      setPriceFilter("all");
                      setFulfillmentFilter("all");
                      setViewMyListingsOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => {
                    if (!currentUser) setIsAuthModalOpen(true);
                    else setIsCreateModalOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>List Your Surplus Compost</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedCompostListings.map((listing) => {
                const isOwner = currentUser?.id === listing.sellerId;
                return (
                  <CompostCard
                    key={listing.id}
                    listing={listing}
                    isOwner={isOwner}
                    onContact={(l) => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setContactListing(l);
                      }
                    }}
                    onViewDetails={(l) => setDetailListing(l)}
                    onEdit={(l) => setEditingListing(l)}
                    onMarkSold={handleMarkSold}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: SEEDS FROM ONLINE STORES */}
      {activeSection === "seeds" && (
        <div className="space-y-6 amc-fade-in">
          {/* Search & Category Filter Bar */}
          <div className="space-y-4 bg-surface/60 p-4 rounded-2xl border border-border/80">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search seeds by variety (e.g. cherry tomato), plant name, or retailer..."
                  value={seedSearchQuery}
                  onChange={(e) => setSeedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-action transition-all"
                />
              </div>

              {/* Seed Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {SEED_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.val}
                    onClick={() => setSeedCategoryFilter(tab.val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                      seedCategoryFilter === tab.val
                        ? "bg-ink text-surface border-ink shadow-2xs"
                        : "bg-surface text-muted border-border hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* External Store Transparency Disclosure Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-bold">Verified External Store Links: </span>
                <span>
                  Seed cultivars below are curated from authorized Indian gardening suppliers (TrustBasket, Ugaoo, AllThatGrows, Bombay Greens). Purchases are completed directly on the seller website; CUST-POST does not charge commissions or process checkout transactions.
                </span>
              </div>
            </div>
          </div>

          {/* Seeds Product Grid */}
          {seedsLoading ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw className="h-6 w-6 text-action animate-spin mx-auto" />
              <p className="text-xs text-muted">Loading verified seed listings...</p>
            </div>
          ) : seedProducts.length === 0 ? (
            <div className="p-12 rounded-[24px] border border-dashed border-border bg-surface text-center space-y-4">
              <ShoppingBag className="h-8 w-8 text-muted mx-auto" />
              <h3 className="font-display text-lg font-bold text-ink">No seed products found</h3>
              <p className="text-xs text-muted">
                No seed cultivars matching &ldquo;{seedSearchQuery}&rdquo;. Try another variety name or clear filters.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSeedSearchQuery("");
                  setSeedCategoryFilter("all");
                }}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {seedProducts.map((product) => (
                <SeedCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchCompostListings()}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      <EditListingModal
        isOpen={!!editingListing}
        listing={editingListing}
        onClose={() => setEditingListing(null)}
        onSuccess={() => fetchCompostListings()}
        currentUser={currentUser}
      />

      <ListingDetailModal
        isOpen={!!detailListing}
        listing={detailListing}
        onClose={() => setDetailListing(null)}
        isOwner={currentUser?.id === detailListing?.sellerId}
        onContact={(l) => {
          if (!currentUser) setIsAuthModalOpen(true);
          else setContactListing(l);
        }}
      />

      <ContactSellerModal
        isOpen={!!contactListing}
        listing={contactListing}
        onClose={() => setContactListing(null)}
        onSuccess={() => fetchCompostListings()}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      <SellerInquiriesModal
        isOpen={isInquiriesModalOpen}
        onClose={() => setIsInquiriesModalOpen(false)}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
