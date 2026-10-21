import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { POST } from "@/app/api/user/delete/route";
import { NextRequest } from "next/server";

describe("Task 28: User Privacy, Auth & Data Deletion Flow", () => {
  describe("AuthModal", () => {
    it("renders magic link option and guest reassurance message", () => {
      render(
        <AuthModal
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/sign in or sync account/i)).toBeInTheDocument();
      expect(screen.getByText(/magic link/i)).toBeInTheDocument();
      expect(screen.getByText(/no account required/i)).toBeInTheDocument();
    });

    it("allows toggling between Magic Link and Password mode", () => {
      render(
        <AuthModal
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      const passwordToggleBtn = screen.getByRole("button", { name: /use password instead/i });
      fireEvent.click(passwordToggleBtn);

      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  describe("API Route: /api/user/delete", () => {
    it("POST /api/user/delete executes wipe and returns success", async () => {
      const req = new NextRequest("http://localhost:3000/api/user/delete", {
        method: "POST",
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toMatch(/data wiped/i);
    });
  });
});
