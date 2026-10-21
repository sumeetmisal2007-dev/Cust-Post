import {
  CompostListing,
  CreateCompostListingInput,
  UpdateCompostListingInput,
  MarketplaceInquiry,
  CreateInquiryInput,
  CompostListingFilters,
  InquiryStatus,
} from "../types/marketplace";

const LISTINGS_STORAGE_KEY = "cust_post_marketplace_listings";
const INQUIRIES_STORAGE_KEY = "cust_post_marketplace_inquiries";

export const INITIAL_MARKETPLACE_LISTINGS: CompostListing[] = [
  {
    id: "mkt-list-1",
    sellerId: "seller-user-1",
    sellerDisplayName: "Sunita Rao",
    title: "5 kg Pure Cured Vermicompost (Worm Castings)",
    description:
      "Double-sifted, completely odorless vermicompost produced from vegetable scraps and cow dung. Extremely gentle on root systems, ideal for potting blends.",
    compostType: "vermicompost",
    priceInr: 180,
    isFree: false,
    quantity: 5,
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80",
    conditionMaturity: "Fully cured (75 days), dark crumbly humus",
    locality: "Indiranagar",
    city: "Bengaluru",
    fulfillmentType: "both",
    status: "active",
    createdAt: "2026-10-18T09:00:00.000Z",
    updatedAt: "2026-10-18T09:00:00.000Z",
  },
  {
    id: "mkt-list-2",
    sellerId: "seller-user-2",
    sellerDisplayName: "Ramesh Patel",
    title: "10 kg Surplus Kitchen-Waste Aerobic Compost",
    description:
      "Surplus compost from our terrace bin setup. Cured for over 3 months, tested with tomato seedlings with zero burn. Free for urban balcony gardeners who bring a bucket.",
    compostType: "kitchen_waste",
    priceInr: 0,
    isFree: true,
    quantity: 10,
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    conditionMaturity: "Fully cured, crumbly texture, pleasant earthy smell",
    locality: "Koregaon Park",
    city: "Pune",
    fulfillmentType: "pickup_only",
    status: "active",
    createdAt: "2026-10-19T11:30:00.000Z",
    updatedAt: "2026-10-19T11:30:00.000Z",
  },
  {
    id: "mkt-list-3",
    sellerId: "seller-user-3",
    sellerDisplayName: "Ananya Iyer",
    title: "2 Bags Seasoned Garden Leaf Mold Compost",
    description:
      "Rich leaf-based compost made from shredded neem and peepal leaves. Excellent moisture-holding capacity for summer terrace containers.",
    compostType: "garden_compost",
    priceInr: 220,
    isFree: false,
    quantity: 2,
    unit: "bags",
    imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
    conditionMaturity: "Aged for 6 months, high fungal activity",
    locality: "Adyar",
    city: "Chennai",
    fulfillmentType: "delivery_available",
    status: "active",
    createdAt: "2026-10-20T14:15:00.000Z",
    updatedAt: "2026-10-20T14:15:00.000Z",
  },
  {
    id: "mkt-list-4",
    sellerId: "seller-user-4",
    sellerDisplayName: "Vikram Malhotra",
    title: "3 kg Fermented Bokashi Pre-Compost Bran",
    description:
      "Anaerobically fermented kitchen scraps treated with effective microorganisms (EM-1). Fully pickled and ready to bury in garden soil or potting containers.",
    compostType: "bokashi",
    priceInr: 150,
    isFree: false,
    quantity: 3,
    unit: "kg",
    conditionMaturity: "Fermented 4 weeks in airtight anaerobic bucket",
    locality: "Bandra West",
    city: "Mumbai",
    fulfillmentType: "pickup_only",
    status: "active",
    createdAt: "2026-10-20T16:45:00.000Z",
    updatedAt: "2026-10-20T16:45:00.000Z",
  },
];

const inMemoryListings = new Map<string, CompostListing>();
const inMemoryInquiries = new Map<string, MarketplaceInquiry>();

function initMemory() {
  if (inMemoryListings.size === 0) {
    INITIAL_MARKETPLACE_LISTINGS.forEach((item) => inMemoryListings.set(item.id, item));
  }
}

function getStoredListings(): CompostListing[] {
  initMemory();
  if (typeof window === "undefined") {
    return Array.from(inMemoryListings.values());
  }
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (!raw) return Array.from(inMemoryListings.values());
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : Array.from(inMemoryListings.values());
  } catch {
    return Array.from(inMemoryListings.values());
  }
}

function saveStoredListings(listings: CompostListing[]): void {
  listings.forEach((l) => inMemoryListings.set(l.id, l));
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  } catch {
    // quota exceeded fallback
  }
}

function getStoredInquiries(): MarketplaceInquiry[] {
  if (typeof window === "undefined") {
    return Array.from(inMemoryInquiries.values());
  }
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) return Array.from(inMemoryInquiries.values());
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return Array.from(inMemoryInquiries.values());
  }
}

function saveStoredInquiries(inquiries: MarketplaceInquiry[]): void {
  inquiries.forEach((inq) => inMemoryInquiries.set(inq.id, inq));
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  } catch {
    // quota exceeded fallback
  }
}

export class MarketplaceService {
  async getListings(filters: CompostListingFilters = {}): Promise<CompostListing[]> {
    let listings = getStoredListings();

    // Status filter: defaults to 'active' for buyers unless specified or listing by owner
    if (filters.status && filters.status !== "all") {
      listings = listings.filter((l) => l.status === filters.status);
    } else if (!filters.sellerId) {
      // Default public browsing shows only active listings
      listings = listings.filter((l) => l.status === "active");
    }

    if (filters.sellerId) {
      listings = listings.filter((l) => l.sellerId === filters.sellerId);
    }

    if (filters.compostType && filters.compostType !== "all") {
      listings = listings.filter((l) => l.compostType === filters.compostType);
    }

    if (filters.priceFilter && filters.priceFilter !== "all") {
      if (filters.priceFilter === "free") {
        listings = listings.filter((l) => l.isFree || l.priceInr === 0);
      } else if (filters.priceFilter === "paid") {
        listings = listings.filter((l) => !l.isFree && l.priceInr > 0);
      }
    }

    if (filters.fulfillmentType && filters.fulfillmentType !== "all") {
      listings = listings.filter(
        (l) => l.fulfillmentType === filters.fulfillmentType || l.fulfillmentType === "both"
      );
    }

    if (filters.city && filters.city.trim()) {
      const city = filters.city.toLowerCase().trim();
      listings = listings.filter((l) => l.city.toLowerCase().includes(city));
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.locality.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          (l.conditionMaturity && l.conditionMaturity.toLowerCase().includes(q))
      );
    }

    return [...listings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getListingById(id: string): Promise<CompostListing | null> {
    const listings = getStoredListings();
    return listings.find((l) => l.id === id) || null;
  }

  async createListing(
    input: CreateCompostListingInput,
    sellerId: string,
    sellerDisplayName: string
  ): Promise<CompostListing> {
    if (!sellerId) {
      throw new Error("Authentication required: Only authenticated sellers can post listings.");
    }

    const nowIso = new Date().toISOString();
    const newListing: CompostListing = {
      ...input,
      id: `mkt-list-${crypto.randomUUID()}`,
      sellerId,
      sellerDisplayName,
      isFree: input.isFree ?? input.priceInr === 0,
      priceInr: input.isFree ? 0 : input.priceInr,
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const current = getStoredListings();
    const updated = [newListing, ...current];
    saveStoredListings(updated);

    return newListing;
  }

  async updateListing(
    id: string,
    updates: UpdateCompostListingInput,
    sellerId: string
  ): Promise<CompostListing> {
    const current = getStoredListings();
    const index = current.findIndex((l) => l.id === id);

    if (index === -1) {
      throw new Error(`Listing ${id} not found.`);
    }

    const listing = current[index];
    if (listing.sellerId !== sellerId) {
      throw new Error("Unauthorized: You can only edit your own listings.");
    }

    const updatedListing: CompostListing = {
      ...listing,
      ...updates,
      isFree: updates.isFree !== undefined ? updates.isFree : listing.isFree,
      priceInr:
        updates.isFree === true
          ? 0
          : updates.priceInr !== undefined
          ? updates.priceInr
          : listing.priceInr,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedListing;
    saveStoredListings(current);

    return updatedListing;
  }

  async markAsSold(id: string, sellerId: string): Promise<CompostListing> {
    return this.updateListing(id, { status: "sold" }, sellerId);
  }

  async deleteListing(id: string, sellerId: string): Promise<boolean> {
    const current = getStoredListings();
    const index = current.findIndex((l) => l.id === id);

    if (index === -1) {
      throw new Error(`Listing ${id} not found.`);
    }

    if (current[index].sellerId !== sellerId) {
      throw new Error("Unauthorized: You can only delete your own listings.");
    }

    current[index] = {
      ...current[index],
      status: "removed",
      updatedAt: new Date().toISOString(),
    };
    saveStoredListings(current);
    return true;
  }

  async createInquiry(input: CreateInquiryInput, buyerId: string): Promise<MarketplaceInquiry> {
    if (!buyerId) {
      throw new Error("Authentication required: Sign in to contact the seller.");
    }

    const listing = await this.getListingById(input.listingId);
    if (!listing) {
      throw new Error("Listing not found.");
    }

    if (listing.status !== "active") {
      throw new Error("Cannot send inquiry: This listing is no longer active.");
    }

    if (listing.sellerId === buyerId) {
      throw new Error("Invalid inquiry: You cannot inquire about your own listing.");
    }

    const newInquiry: MarketplaceInquiry = {
      id: `inq-${crypto.randomUUID()}`,
      listingId: input.listingId,
      listingTitle: listing.title,
      buyerId,
      sellerId: listing.sellerId,
      buyerName: input.buyerName,
      buyerContact: input.buyerContact,
      message: input.message,
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    const current = getStoredInquiries();
    saveStoredInquiries([newInquiry, ...current]);

    return newInquiry;
  }

  async getInquiriesForUser(
    userId: string,
    role: "seller" | "buyer" | "all" = "all"
  ): Promise<MarketplaceInquiry[]> {
    if (!userId) return [];
    const all = getStoredInquiries();

    let filtered = all.filter((inq) => {
      if (role === "seller") return inq.sellerId === userId;
      if (role === "buyer") return inq.buyerId === userId;
      return inq.sellerId === userId || inq.buyerId === userId;
    });

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateInquiryStatus(
    id: string,
    status: InquiryStatus,
    userId: string
  ): Promise<MarketplaceInquiry> {
    const all = getStoredInquiries();
    const index = all.findIndex((i) => i.id === id);

    if (index === -1) {
      throw new Error(`Inquiry ${id} not found.`);
    }

    const inquiry = all[index];
    if (inquiry.sellerId !== userId && inquiry.buyerId !== userId) {
      throw new Error("Unauthorized to access this inquiry.");
    }

    all[index] = { ...inquiry, status };
    saveStoredInquiries(all);
    return all[index];
  }

  clearMemory(): void {
    inMemoryListings.clear();
    inMemoryInquiries.clear();
    initMemory();
  }
}

export const marketplaceService = new MarketplaceService();
