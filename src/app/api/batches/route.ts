import { NextRequest, NextResponse } from "next/server";
import { createBatchSchema } from "@/lib/validation/batch.schema";
import { batchStorageService } from "@/lib/services/batch-storage.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createBatchSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Check optional authenticated user session
    let userId: string | undefined = undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Guest or local mode without Supabase connection
    }

    const batch = await batchStorageService.createBatch(parseResult.data, userId);

    return NextResponse.json({ success: true, batch }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let userId: string | undefined = undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Guest mode
    }

    const batches = await batchStorageService.listBatches(userId);
    return NextResponse.json({ success: true, batches }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
