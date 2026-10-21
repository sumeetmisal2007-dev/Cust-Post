import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Preloader } from "@/components/ui/preloader";
import { createClient } from "@/lib/supabase/client";

describe("Google Authentication Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "cust_post_user=; path=/; max-age=0";
    vi.restoreAllMocks();
  });

  describe("AuthModal Google Sign-In", () => {
    it("renders the Continue with Google action button", () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />);

      const googleBtn = screen.getByRole("button", { name: /continue with google/i });
      expect(googleBtn).toBeInTheDocument();
    });

    it("executes Google sign-in and updates local authentication state", async () => {
      const onCloseMock = vi.fn();
      render(<AuthModal isOpen={true} onClose={onCloseMock} />);

      const googleBtn = screen.getByRole("button", { name: /continue with google/i });
      fireEvent.click(googleBtn);

      await waitFor(() => {
        expect(screen.getByText(/signed in with google successfully/i)).toBeInTheDocument();
      });

      // Verify client auth recognizes user
      const client = createClient();
      const { data } = await client.auth.getUser();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe("sumeetmisal2007@gmail.com");
      expect(data.user?.user_metadata?.provider).toBe("google");
    });
  });

  describe("Client & Server Supabase Mock Parity", () => {
    it("signs out and clears Google user state", async () => {
      const client = createClient();

      // Sign in
      await client.auth.signInWithOAuth({ provider: "google" });
      let { data } = await client.auth.getUser();
      expect(data.user?.email).toBe("sumeetmisal2007@gmail.com");

      // Sign out
      await client.auth.signOut();
      const afterSignOut = await client.auth.getUser();
      expect(afterSignOut.data.user).toBeNull();
    });
  });
});
