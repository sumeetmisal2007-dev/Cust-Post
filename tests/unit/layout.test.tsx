import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";
import manifest from "@/app/manifest";

describe("Layout Components (Task 14)", () => {
  describe("Header", () => {
    it("renders brand logo and primary navigation links", () => {
      render(<Header />);
      expect(screen.getByRole("link", { name: /cust-post/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /plan setup/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /my batch/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /learn/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /exchange/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sources/i })).toBeInTheDocument();
    });

    it("renders primary [Start a setup] CTA button", () => {
      render(<Header />);
      const ctaButtons = screen.getAllByRole("link", { name: /start a setup/i });
      expect(ctaButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Footer", () => {
    it("renders SDG 12 alignment and disclaimer links", () => {
      render(<Footer />);
      expect(screen.getByText(/un sdg 12/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sources & methodology/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /report feedback/i })).toBeInTheDocument();
    });
  });

  describe("PWA Configuration (Feature 3)", () => {
    it("generates valid PWA webmanifest with standalone display and theme color", () => {
      const manifestData = manifest();
      expect(manifestData.name).toContain("Cust-Post");
      expect(manifestData.short_name).toBe("Cust-Post");
      expect(manifestData.display).toBe("standalone");
      expect(manifestData.theme_color).toBe("#224734");
      expect(manifestData.icons?.length).toBeGreaterThanOrEqual(1);
    });

    it("renders PwaRegistrar without crashing", () => {
      const { container } = render(<PwaRegistrar />);
      expect(container).toBeDefined();
    });
  });
});
