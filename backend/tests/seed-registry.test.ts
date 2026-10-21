import { describe, it, expect } from "vitest";
import {
  seedProductsRegistry,
  EXTERNAL_SEED_PRODUCTS,
} from "../src/data/seed-products-registry";

describe("Seed Products Registry (Task 2)", () => {
  it("provides legitimate seed listings with verified retailer names and safe URLs", () => {
    expect(EXTERNAL_SEED_PRODUCTS.length).toBeGreaterThanOrEqual(6);

    for (const product of EXTERNAL_SEED_PRODUCTS) {
      expect(product.id).toBeDefined();
      expect(product.name).toBeTruthy();
      expect(product.variety).toBeTruthy();
      expect(["vegetable", "fruit", "herb", "flower"]).toContain(product.category);
      expect(product.retailerName).toBeTruthy();
      expect(product.productUrl).toMatch(/^https:\/\//);
      expect(product.sourceAttribution).toBeTruthy();
      expect(product.lastVerifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(product.currency).toBe("INR");
      if (product.priceInr !== undefined) {
        expect(product.priceInr).toBeGreaterThan(0);
      }
    }
  });

  it("filters seed products by category", () => {
    const herbs = seedProductsRegistry.getAllProducts("herb");
    expect(herbs.length).toBeGreaterThan(0);
    expect(herbs.every((p) => p.category === "herb")).toBe(true);

    const flowers = seedProductsRegistry.getAllProducts("flower");
    expect(flowers.length).toBeGreaterThan(0);
    expect(flowers.every((p) => p.category === "flower")).toBe(true);
  });

  it("searches seed products by variety, name or retailer", () => {
    const spinachSearch = seedProductsRegistry.getAllProducts("all", "spinach");
    expect(spinachSearch.length).toBeGreaterThan(0);
    expect(spinachSearch[0].name.toLowerCase()).toContain("spinach");

    const retailerSearch = seedProductsRegistry.getAllProducts("all", "trustbasket");
    expect(retailerSearch.length).toBeGreaterThan(0);
    expect(retailerSearch.every((p) => p.retailerName.toLowerCase() === "trustbasket")).toBe(true);
  });

  it("retrieves product by id safely", () => {
    const item = seedProductsRegistry.getProductById("seed-tb-spinach");
    expect(item).toBeDefined();
    expect(item?.retailerName).toBe("TrustBasket");
  });
});
