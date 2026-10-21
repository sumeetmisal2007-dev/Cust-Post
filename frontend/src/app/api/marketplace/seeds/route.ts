import { NextRequest, NextResponse } from "next/server";
import { seedProductsRegistry, SeedCategory } from "@cust-post/backend";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") as SeedCategory | "all" | null;
    const query = searchParams.get("query") || undefined;

    const products = seedProductsRegistry.getAllProducts(category || undefined, query);

    return NextResponse.json(
      {
        success: true,
        products,
        meta: {
          disclaimer:
            "External store listings are provided for gardener convenience. Seeds are purchased directly through the retailer website. CUST-POST does not process external transactions or guarantee third-party inventory.",
          total: products.length,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
