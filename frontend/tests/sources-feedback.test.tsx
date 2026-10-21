import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { SOURCES_REGISTRY } from "@cust-post/backend";

describe("Task 27: Rule Provenance & User Feedback Mechanism", () => {
  describe("Sources Registry Integrity", () => {
    it("ensures all registered rules contain valid title, organization, and url", () => {
      const sources = Object.values(SOURCES_REGISTRY);
      expect(sources.length).toBeGreaterThanOrEqual(10);

      sources.forEach((s) => {
        expect(s.ruleId).toBeDefined();
        expect(s.title).toBeDefined();
        expect(s.organization).toBeDefined();
        expect(s.sourceUrl).toMatch(/^https?:\/\//);
      });
    });
  });

  describe("FeedbackModal", () => {
    it("renders issue type choices and description textarea", () => {
      render(
        <FeedbackModal
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/submit rule or guidance feedback/i)).toBeInTheDocument();
      expect(screen.getByText(/what type of issue did you notice\?/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/describe what seemed confusing/i)).toBeInTheDocument();
    });

    it("validates input and submits feedback report", async () => {
      const handleClose = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, id: "fb-123" }),
      });
      global.fetch = mockFetch;

      render(
        <FeedbackModal
          isOpen={true}
          onClose={handleClose}
          contextSnapshot={{ step: "recommendations" }}
        />
      );

      const textarea = screen.getByPlaceholderText(/describe what seemed confusing/i);
      fireEvent.change(textarea, { target: { value: "The aeration instruction was unclear for my bucket." } });

      const submitBtn = screen.getByRole("button", { name: /submit feedback/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/feedback",
          expect.objectContaining({
            method: "POST",
          })
        );
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });
});
