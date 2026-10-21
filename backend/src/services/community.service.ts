import { ExchangeListing, CreateListingInput, ExchangeCategory } from "../types/community";

const EXCHANGE_STORAGE_KEY = "cust_post_community_listings";

export const INITIAL_COMMUNITY_LISTINGS: ExchangeListing[] = [
  {
    id: "init-1",
    title: "5L Cured Aerobic Compost ready for balcony pot blend",
    category: "surplus_compost",
    description:
      "Fully cured for 60 days, dark crumbly texture with earthy forest smell. Great for 20-25% pot blends for tomatoes, chillies, or herbs.",
    neighborhood: "Indiranagar",
    city: "Bengaluru",
    contactMethod: "whatsapp",
    contactHandle: "+91 98450 12345",
    isAvailable: true,
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "init-2",
    title: "Rooted Pudina / Mint cuttings & Krishna Tulsi seeds",
    category: "seeds_cuttings",
    description:
      "Healthy water-rooted mint cuttings ready for potting, plus fresh harvested Krishna Tulsi seed pods. Free for any balcony gardener.",
    neighborhood: "Bandra West",
    city: "Mumbai",
    contactMethod: "telegram",
    contactHandle: "@urban_green_mumbai",
    isAvailable: true,
    relatedPlantSlug: "mint",
    createdAt: "2026-10-19T14:30:00.000Z",
  },
  {
    id: "init-3",
    title: "Bag of dry shredded leaves & brown cardboard",
    category: "browns",
    description:
      "Two 20L bags of crispy dry neem/peepal leaves and clean unbleached shredded cardboard browns ready for carbon balancing.",
    neighborhood: "Koregaon Park",
    city: "Pune",
    contactMethod: "whatsapp",
    contactHandle: "+91 98230 54321",
    isAvailable: true,
    createdAt: "2026-10-19T16:00:00.000Z",
  },
  {
    id: "init-4",
    title: "Desi Cherry Tomato heirloom seeds (Heavy Yield)",
    category: "seeds_cuttings",
    description:
      "Sun-dried organic seeds from vigorous 20L balcony vine. Germination tested at 90%. Happy to share seed packets with beginners.",
    neighborhood: "Jubilee Hills",
    city: "Hyderabad",
    contactMethod: "email",
    contactHandle: "balconygardener.hyd@gmail.com",
    isAvailable: true,
    relatedPlantSlug: "cherry-tomato",
    createdAt: "2026-10-20T08:00:00.000Z",
  },
  {
    id: "init-5",
    title: "Two 15L Terracotta nursery pots looking for a home",
    category: "pots_tools",
    description:
      "Clean terracotta pots with bottom drainage hole intact. Perfect for eggplants, okra, or bush citrus.",
    neighborhood: "Vasant Kunj",
    city: "New Delhi",
    contactMethod: "whatsapp",
    contactHandle: "+91 98110 67890",
    isAvailable: true,
    createdAt: "2026-10-20T11:00:00.000Z",
  },
  {
    id: "init-6",
    title: "Rich Vermicompost worm castings surplus (3 kg)",
    category: "surplus_compost",
    description:
      "Triple-sifted pure vermicompost castings. High microbiological activity, gentle on seedling roots. Bring your own container.",
    neighborhood: "Adyar",
    city: "Chennai",
    contactMethod: "telegram",
    contactHandle: "@chennai_soil_club",
    isAvailable: true,
    createdAt: "2026-10-20T13:00:00.000Z",
  },
];

function getStoredListings(): ExchangeListing[] {
  if (typeof window === "undefined") {
    return INITIAL_COMMUNITY_LISTINGS;
  }
  try {
    const raw = localStorage.getItem(EXCHANGE_STORAGE_KEY);
    if (!raw) return INITIAL_COMMUNITY_LISTINGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMMUNITY_LISTINGS;
  } catch {
    return INITIAL_COMMUNITY_LISTINGS;
  }
}

function saveStoredListings(listings: ExchangeListing[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXCHANGE_STORAGE_KEY, JSON.stringify(listings));
  } catch {

  }
}

export class CommunityService {
  async getListings(category?: ExchangeCategory | "all", query?: string): Promise<ExchangeListing[]> {
    let listings = getStoredListings();

    if (category && category !== "all") {
      listings = listings.filter((item) => item.category === category);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      listings = listings.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.neighborhood.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q)
      );
    }

    return [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createListing(input: CreateListingInput): Promise<ExchangeListing> {
    const newListing: ExchangeListing = {
      ...input,
      id: `list-${crypto.randomUUID()}`,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    };

    const current = getStoredListings();
    const updated = [newListing, ...current];
    saveStoredListings(updated);

    return newListing;
  }

  async toggleAvailability(id: string): Promise<ExchangeListing | null> {
    const current = getStoredListings();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return null;

    current[index] = {
      ...current[index],
      isAvailable: !current[index].isAvailable,
    };

    saveStoredListings(current);
    return current[index];
  }
}

export const communityService = new CommunityService();
