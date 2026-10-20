export type ExchangeCategory =
  | "surplus_compost"
  | "seeds_cuttings"
  | "browns"
  | "pots_tools";

export interface ExchangeListing {
  id: string;
  title: string;
  category: ExchangeCategory;
  description: string;
  neighborhood: string;
  city: string;
  contactMethod: "whatsapp" | "telegram" | "email" | "phone";
  contactHandle: string;
  isAvailable: boolean;
  relatedPlantSlug?: string;
  createdAt: string;
}

export interface CreateListingInput {
  title: string;
  category: ExchangeCategory;
  description: string;
  neighborhood: string;
  city: string;
  contactMethod: "whatsapp" | "telegram" | "email" | "phone";
  contactHandle: string;
  relatedPlantSlug?: string;
}
