import { NextRequest, NextResponse } from "next/server";
import {
  updateCompostListingSchema,
  marketplaceService,
} from "@cust-post/backend";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await marketplaceService.getListingById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parseResult = updateCompostListingSchema.safeParse(body);

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
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        sellerId = user.id;
      }
    } catch {
      // Fallback
    }

    if (!sellerId) {
      sellerId = request.headers.get("x-user-id");
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: "Authentication required to modify listing" },
        { status: 401 }
      );
    }

    const updatedListing = await marketplaceService.updateListing(
      id,
      parseResult.data,
      sellerId
    );

    return NextResponse.json(
      { success: true, listing: updatedListing },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let sellerId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        sellerId = user.id;
      }
    } catch {
      // Fallback
    }

    if (!sellerId) {
      sellerId = request.headers.get("x-user-id");
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: "Authentication required to remove listing" },
        { status: 401 }
      );
    }

    await marketplaceService.deleteListing(id, sellerId);
    return NextResponse.json(
      { success: true, message: "Listing removed successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
