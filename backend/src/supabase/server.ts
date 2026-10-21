import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";

  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Handled gracefully in server components
        }
      },
    },
  });

  if (supabaseUrl.includes("dummy") || supabaseAnonKey === "dummy-anon-key") {
    client.auth.getUser = async (jwt?: string) => {
      const devCookie = cookieStore.get("cust_post_user");
      if (devCookie?.value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(devCookie.value));
          return {
            data: {
              user: {
                id: parsed.id || "usr_google_sumeet",
                email: parsed.email || "sumeetmisal2007@gmail.com",
                user_metadata: {
                  display_name: parsed.name || "Sumeet Misal",
                  full_name: parsed.name || "Sumeet Misal",
                  avatar_url: parsed.avatar_url || "https://lh3.googleusercontent.com/a/default-user",
                  provider: "google",
                },
                app_metadata: { provider: "google" },
                aud: "authenticated",
                created_at: parsed.created_at || new Date().toISOString(),
              } as any,
            },
            error: null,
          };
        } catch {
          // Fallback
        }
      }
      return { data: { user: null }, error: null };
    };
  }

  return client;
}
