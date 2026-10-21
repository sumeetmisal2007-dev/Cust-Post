export type CompostType =
  | "vermicompost"
  | "kitchen_waste"
  | "garden_compost"
  | "bokashi"
  | "other";

export type ListingStatus = "active" | "sold" | "removed";

export type FulfillmentType = "pickup_only" | "delivery_available" | "both";

export interface CompostListing {
  id: string;
  sellerId: string;
  sellerDisplayName: string;
  title: string;
  description: string;
  compostType: CompostType;
  priceInr: number;
  isFree: boolean;
  quantity: number;
  unit: "kg" | "bags" | "litres";
  imageUrl?: string;
  conditionMaturity?: string;
  locality: string;
  city: string;
  fulfillmentType: FulfillmentType;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompostListingInput {
  title: string;
  description: string;
  compostType: CompostType;
  priceInr: number;
  isFree?: boolean;
  quantity: number;
  unit: "kg" | "bags" | "litres";
  imageUrl?: string;
  conditionMaturity?: string;
  locality: string;
  city: string;
  fulfillmentType: FulfillmentType;
}

export interface UpdateCompostListingInput {
  title?: string;
  description?: string;
  compostType?: CompostType;
  priceInr?: number;
  isFree?: boolean;
  quantity?: number;
  unit?: "kg" | "bags" | "litres";
  imageUrl?: string;
  conditionMaturity?: string;
  locality?: string;
  city?: string;
  fulfillmentType?: FulfillmentType;
  status?: ListingStatus;
}

export type InquiryStatus = "unread" | "replied" | "closed";

export interface MarketplaceInquiry {
  id: string;
  listingId: string;
  listingTitle?: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  buyerContact: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface CreateInquiryInput {
  listingId: string;
  sellerId: string;
  buyerName: string;
  buyerContact: string;
  message: string;
}

export type SeedCategory = "vegetable" | "fruit" | "herb" | "flower";

export interface ExternalSeedProduct {
  id: string;
  name: string;
  variety: string;
  category: SeedCategory;
  retailerName: string;
  productUrl: string;
  imageUrl?: string;
  priceInr?: number;
  currency: string;
  sourceAttribution: string;
  lastVerifiedDate: string;
  isActive: boolean;
  description?: string;
}

export interface CompostListingFilters {
  compostType?: CompostType | "all";
  priceFilter?: "all" | "free" | "paid";
  fulfillmentType?: FulfillmentType | "all";
  query?: string;
  city?: string;
  status?: ListingStatus | "all";
  sellerId?: string;
}
