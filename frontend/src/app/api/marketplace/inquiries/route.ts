import { NextRequest, NextResponse } from "next/server";
import {
  createInquirySchema,
  marketplaceService,
} from "@cust-post/backend";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Fallback
    }

    if (!userId) {
      userId = request.headers.get("x-user-id");
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to view private inquiries" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const role = (searchParams.get("role") as "seller" | "buyer" | "all") || "all";

    const inquiries = await marketplaceService.getInquiriesForUser(userId, role);
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createInquirySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    let buyerId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        buyerId = user.id;
      }
    } catch {
      // Fallback
    }

    if (!buyerId) {
      buyerId = request.headers.get("x-user-id");
    }

    if (!buyerId) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "You must be signed in to contact the seller.",
        },
        { status: 401 }
      );
    }

    const inquiry = await marketplaceService.createInquiry(
      parseResult.data,
      buyerId
    );

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
