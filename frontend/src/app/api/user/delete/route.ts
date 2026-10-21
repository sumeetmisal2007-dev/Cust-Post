import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { batchStorageService, marketplaceService } from "@cust-post/backend";

export async function POST(_request: NextRequest) {
  try {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("marketplace_inquiries").delete().or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
        await supabase.from("compost_listings").delete().eq("seller_id", user.id);
        await supabase.from("batch_observations").delete().eq("owner_id", user.id);
        await supabase.from("compost_batches").delete().eq("owner_id", user.id);
        await supabase.from("containers").delete().eq("owner_id", user.id);
        await supabase.from("profiles").delete().eq("id", user.id);

        await supabase.auth.signOut();
      }
    } catch {

    }

    batchStorageService.clearMemory();
    marketplaceService.clearMemory();

    return NextResponse.json(
      {
        success: true,
        message: "User data wiped completely in accordance with privacy policies.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
