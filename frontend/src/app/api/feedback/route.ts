import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@cust-post/backend";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { issueType, description, contextSnapshot } = result.data;

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;

      // Try inserting into user_feedback table if Supabase is connected
      const { data, error } = await supabase
        .from("user_feedback")
        .insert({
          owner_id: userId,
          issue_type: issueType,
          description,
          context_snapshot: contextSnapshot || {},
        })
        .select("id")
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, id: data.id }, { status: 201 });
      }
    } catch {
      // In guest or local mode without active DB
    }

    const fallbackId = `feedback-${Date.now()}`;
    return NextResponse.json({ success: true, id: fallbackId }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
