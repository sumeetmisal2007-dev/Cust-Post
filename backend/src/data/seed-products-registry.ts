import { ExternalSeedProduct, SeedCategory } from "../types/marketplace";

/**
 * Seed Products Registry: Curated catalogue of external seed products
 * sold by verified online gardening stores in India.
 *
 * Attribution Notice:
 * All trademarks, brand names, and original product links are the property
 * of their respective retailers (TrustBasket, Ugaoo, AllThatGrows, Bombay Greens).
 * CUST-POST does not scrape retailer websites, does not alter prices, and displays
 * the date each listing was manually verified.
 */
export const EXTERNAL_SEED_PRODUCTS: ExternalSeedProduct[] = [
  {
    id: "seed-tb-spinach",
    name: "Spinach / Palak",
    variety: "All Green Spinach (Spinacia oleracea)",
    category: "vegetable",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/spinach-seeds",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    priceInr: 79,
    currency: "INR",
    sourceAttribution: "TrustBasket India Certified Seeds",
    lastVerifiedDate: "2026-10-15",
    isActive: true,
    description: "Fast-growing open-pollinated leafy spinach, well-suited for shallow 6-inch balcony planter trays.",
  },
  {
    id: "seed-atg-tomato",
    name: "Cherry Tomato",
    variety: "Solanum lycopersicum var. cerasiforme (Red Round)",
    category: "vegetable",
    retailerName: "AllThatGrows",
    productUrl: "https://www.allthatgrows.in/products/cherry-tomato-seeds",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
    priceInr: 95,
    currency: "INR",
    sourceAttribution: "AllThatGrows Non-Hybrid Seeds",
    lastVerifiedDate: "2026-10-18",
    isActive: true,
    description: "Prolific indeterminate cherry tomato variety suited for 15-20L balcony containers with stake support.",
  },
  {
    id: "seed-ug-tulsi",
    name: "Krishna Tulsi",
    variety: "Ocimum tenuiflorum (Dark Purple Basil)",
    category: "herb",
    retailerName: "Ugaoo",
    productUrl: "https://www.ugaoo.com/products/krishna-tulsi-seeds",
    imageUrl: "/images/plants/tulsi.png",
    priceInr: 85,
    currency: "INR",
    sourceAttribution: "Ugaoo Urban Garden Seeds",
    lastVerifiedDate: "2026-10-18",
    isActive: true,
    description: "Aromatic sacred medicinal basil with high resilience in warm Indian climates and clay containers.",
  },
  {
    id: "seed-tb-coriander",
    name: "Coriander / Dhaniya",
    variety: "Coriandrum sativum (Multi-cut Indian Variety)",
    category: "herb",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/coriander-seeds",
    imageUrl: "/images/plants/coriander.png",
    priceInr: 69,
    currency: "INR",
    sourceAttribution: "TrustBasket Open-Pollinated Garden Pack",
    lastVerifiedDate: "2026-10-19",
    isActive: true,
    description: "Fast germinating, multi-cut aromatic coriander suitable for balcony window boxes and compost-rich soil.",
  },
  {
    id: "seed-bg-marigold",
    name: "French Marigold / Genda",
    variety: "Tagetes patula (Petite Orange & Yellow)",
    category: "flower",
    retailerName: "Bombay Greens",
    productUrl: "https://bombaygreens.com/products/marigold-seeds",
    imageUrl: "/images/plants/marigold.png",
    priceInr: 89,
    currency: "INR",
    sourceAttribution: "Bombay Greens Seed Packets",
    lastVerifiedDate: "2026-10-19",
    isActive: true,
    description: "Essential companion planting flower for balcony pest deterrent, root protection, and pollinator attraction.",
  },
  {
    id: "seed-atg-zinnia",
    name: "Zinnia Elegans Mix",
    variety: "Zinnia elegans (Dwarf Double Flower Mix)",
    category: "flower",
    retailerName: "AllThatGrows",
    productUrl: "https://www.allthatgrows.in/products/zinnia-dwarf-mixed-seeds",
    imageUrl: "/images/plants/zinnia.png",
    priceInr: 95,
    currency: "INR",
    sourceAttribution: "AllThatGrows Garden Seeds",
    lastVerifiedDate: "2026-10-20",
    isActive: true,
    description: "Bright sun-loving blooms that thrive in sunny balcony containers and bring vibrant colours all summer.",
  },
  {
    id: "seed-ug-chilli",
    name: "Thai Hot Chilli",
    variety: "Capsicum annuum (Pungent Indian Cultivar)",
    category: "vegetable",
    retailerName: "Ugaoo",
    productUrl: "https://www.ugaoo.com/products/thai-chilli-seeds",
    imageUrl: "/images/plants/green-chili.png",
    priceInr: 85,
    currency: "INR",
    sourceAttribution: "Ugaoo Seed Bank",
    lastVerifiedDate: "2026-10-20",
    isActive: true,
    description: "Compact upright perennial shrub bearing sharp fiery chillies, thriving in 10-15L pots with rich compost humus.",
  },
  {
    id: "seed-tb-strawberry",
    name: "Alpine Strawberry",
    variety: "Fragaria vesca (Sweet Alpine Runnerless)",
    category: "fruit",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/strawberry-seeds",
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80",
    priceInr: 120,
    currency: "INR",
    sourceAttribution: "TrustBasket Certified Fruit Seeds",
    lastVerifiedDate: "2026-10-18",
    isActive: true,
    description: "Runnerless compact strawberry variety ideal for hanging baskets and tiered balcony pots.",
  },
  {
    id: "seed-ug-sweet-basil",
    name: "Sweet Basil (Italian Genovese)",
    variety: "Ocimum basilicum (Large Fragrant Leaf)",
    category: "herb",
    retailerName: "Ugaoo",
    productUrl: "https://www.ugaoo.com/products/basil-seeds",
    imageUrl: "/images/plants/sweet-basil.jpg",
    priceInr: 79,
    currency: "INR",
    sourceAttribution: "Ugaoo Herb Seed Collection",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Aromatic culinary basil delivering tender sweet foliage for pestos and salads, thriving in warm compost-enriched potting mix.",
  },
  {
    id: "seed-tb-methi",
    name: "Fenugreek / Methi",
    variety: "Trigonella foenum-graecum (Kasuri Multi-cut)",
    category: "vegetable",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/methi-seeds",
    imageUrl: "/images/plants/methi.png",
    priceInr: 59,
    currency: "INR",
    sourceAttribution: "TrustBasket High-Germination Pack",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Fast-growing balcony micro-green and culinary staple ready for initial harvest in just 21 days.",
  },
  {
    id: "seed-atg-brinjal",
    name: "Brinjal / Baingan",
    variety: "Solanum melongena (Pusa Purple Round)",
    category: "vegetable",
    retailerName: "AllThatGrows",
    productUrl: "https://www.allthatgrows.in/products/brinjal-round-seeds",
    imageUrl: "/images/plants/brinjal.png",
    priceInr: 85,
    currency: "INR",
    sourceAttribution: "AllThatGrows Desi Vegetable Seeds",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Sturdy heavy-fruiting eggplant variety yielding glossy dark purple brinjals in 15-20L balcony grow bags.",
  },
  {
    id: "seed-ug-karela",
    name: "Bitter Gourd / Karela",
    variety: "Momordica charantia (Pusa Do Mausami)",
    category: "vegetable",
    retailerName: "Ugaoo",
    productUrl: "https://www.ugaoo.com/products/karela-seeds",
    imageUrl: "/images/plants/bitter-gourd.png",
    priceInr: 89,
    currency: "INR",
    sourceAttribution: "Ugaoo Hybrid Climbers",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Vigorous vertical climber for balcony grills yielding ridged dark green medicinal bitter gourds.",
  },
  {
    id: "seed-bg-red-amaranth",
    name: "Red Amaranth / Lal Saag",
    variety: "Amaranthus tricolor (Pusa Lal Chaulai)",
    category: "vegetable",
    retailerName: "Bombay Greens",
    productUrl: "https://bombaygreens.com/products/red-amaranth-seeds",
    imageUrl: "/images/plants/red-amaranth.png",
    priceInr: 75,
    currency: "INR",
    sourceAttribution: "Bombay Greens Native Seeds",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Iron-rich crimson leafy green thriving through hot summers, ready for multi-cut harvest in 25 days.",
  },
  {
    id: "seed-tb-curry-leaf",
    name: "Curry Leaves / Kadi Patta",
    variety: "Murraya koenigii (Aromatic Suwasini)",
    category: "herb",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/curry-leaves-seeds",
    imageUrl: "/images/plants/curry-leaves.jpg",
    priceInr: 99,
    currency: "INR",
    sourceAttribution: "TrustBasket Aromatic Herbs",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Essential Indian tempering aromatic, growing into a lush container bush with warm sun and compost top-dressing.",
  },
  {
    id: "seed-bg-ajwain",
    name: "Ajwain Leaves / Karpuravalli",
    variety: "Plectranthus amboinicus (Indian Borage)",
    category: "herb",
    retailerName: "Bombay Greens",
    productUrl: "https://bombaygreens.com/products/ajwain-seeds",
    imageUrl: "/images/plants/ajwain-leaves.png",
    priceInr: 79,
    currency: "INR",
    sourceAttribution: "Bombay Greens Urban Herbals",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Succulent medicinal herb with thick aromatic leaves prized for pakoras, herbal teas, and soothing remedies.",
  },
  {
    id: "seed-tb-guava",
    name: "Dwarf Guava / Amrood",
    variety: "Psidium guajava (Thai Dwarf Container Selection)",
    category: "fruit",
    retailerName: "TrustBasket",
    productUrl: "https://trustbasket.com/collections/seeds/products/guava-seeds",
    imageUrl: "/images/plants/dwarf-guava.png",
    priceInr: 110,
    currency: "INR",
    sourceAttribution: "TrustBasket Fruit Seeds",
    lastVerifiedDate: "2026-10-21",
    isActive: true,
    description: "Compact fruiting tree tailored for 25L balcony containers, producing fragrant blooms and crisp sweet guavas.",
  },
];

export class SeedProductsRegistry {
  private products: ExternalSeedProduct[] = [...EXTERNAL_SEED_PRODUCTS];

  getAllProducts(category?: SeedCategory | "all", query?: string): ExternalSeedProduct[] {
    let result = this.products.filter((p) => p.isActive);

    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.variety.toLowerCase().includes(q) ||
          p.retailerName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getProductById(id: string): ExternalSeedProduct | undefined {
    return this.products.find((p) => p.id === id && p.isActive);
  }
}

export const seedProductsRegistry = new SeedProductsRegistry();
