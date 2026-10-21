import { NextRequest, NextResponse } from "next/server";
import {
  createCompostListingSchema,
  marketplaceService,
  CompostType,
  FulfillmentType,
  ListingStatus,
} from "@cust-post/backend";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const compostType = searchParams.get("compostType") as CompostType | "all" | null;
    const priceFilter = searchParams.get("priceFilter") as "all" | "free" | "paid" | null;
    const fulfillmentType = searchParams.get("fulfillmentType") as FulfillmentType | "all" | null;
    const city = searchParams.get("city") || undefined;
    const query = searchParams.get("query") || undefined;
    const sellerId = searchParams.get("sellerId") || undefined;
    const status = (searchParams.get("status") as ListingStatus | "all" | null) || undefined;

    const listings = await marketplaceService.getListings({
      compostType: compostType || undefined,
      priceFilter: priceFilter || undefined,
      fulfillmentType: fulfillmentType || undefined,
      city,
      query,
      sellerId,
      status,
    });

    return NextResponse.json({ success: true, listings }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createCompostListingSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    let sellerId: string | null = null;
    let sellerName: string = "Urban Gardener";

    // 1. Authenticate seller with Supabase auth
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        sellerId = user.id;
        sellerName =
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Urban Gardener";
      }
    } catch {
      // Fallback below
    }

    // Support client auth header in mock/test setups
    if (!sellerId) {
      const headerUserId = request.headers.get("x-user-id");
      const headerUserName = request.headers.get("x-user-name");
      if (headerUserId) {
        sellerId = headerUserId;
        sellerName = headerUserName || "Urban Gardener";
      }
    }

    if (!sellerId) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "You must be signed in to create a marketplace listing.",
        },
        { status: 401 }
      );
    }

    const listing = await marketplaceService.createListing(
      parseResult.data,
      sellerId,
      sellerName
    );

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
