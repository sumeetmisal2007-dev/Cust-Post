import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const isTest = process.env.NODE_ENV === "test";
  const supabaseUrl =
    isTest
      ? "https://dummy.supabase.co"
      : process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE ||
        "https://zzacpqygdfhvgzujepev.supabase.co";
  const supabaseAnonKey =
    isTest
      ? "dummy-anon-key"
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_1212 ||
        "sb_publishable_xb8joYeimsbWrntBrTqnPQ_boWQWzCj";

  const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

  if (supabaseUrl.includes("dummy") || supabaseAnonKey === "dummy-anon-key") {
    (client.auth as any).getUser = async () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("cust_post_user");
          const cookieMatch = document.cookie.match(/cust_post_user=([^;]+)/);
          const raw = stored || (cookieMatch ? decodeURIComponent(cookieMatch[1]) : null);

          if (raw) {
            const parsed = JSON.parse(raw);
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
          }
        } catch {
          // Fallback
        }
        return { data: { user: null }, error: null };
      }
      return { data: { user: null }, error: null };
    };

    (client.auth as any).signInWithOAuth = async (credentials: any) => {
      const mockUser = {
        id: "usr_google_sumeet",
        email: "sumeetmisal2007@gmail.com",
        name: "Sumeet Misal",
        avatar_url: "https://lh3.googleusercontent.com/a/default-user",
        provider: "google",
        created_at: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        const serialized = JSON.stringify(mockUser);
        localStorage.setItem("cust_post_user", serialized);
        document.cookie = `cust_post_user=${encodeURIComponent(
          serialized
        )}; path=/; max-age=604800; SameSite=Lax`;
      }

      return {
        data: { provider: credentials?.provider || "google", url: "" },
        error: null,
      };
    };

    (client.auth as any).signOut = async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cust_post_user");
        document.cookie = "cust_post_user=; path=/; max-age=0; SameSite=Lax";
      }
      return { error: null };
    };
  }

  return client;
}
