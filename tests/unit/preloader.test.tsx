import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { Preloader } from "@/components/ui/preloader";

describe("Preloader Animation Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the animated preloader on first session visit", () => {
    render(<Preloader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/cust-post/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /skip/i })).toBeInTheDocument();
  });

  it("allows dismissing via Skip button and persists to sessionStorage", () => {
    render(<Preloader />);
    const skipButton = screen.getByRole("button", { name: /skip/i });
    fireEvent.click(skipButton);

    expect(sessionStorage.getItem("cust_post_preloader_seen")).toBe("true");
  });

  it("completes animation sequence over time and finishes", () => {
    render(<Preloader durationMs={1000} />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(sessionStorage.getItem("cust_post_preloader_seen")).toBe("true");
  });

  it("bypasses display if session already marked as seen", () => {
    sessionStorage.setItem("cust_post_preloader_seen", "true");
    const { container } = render(<Preloader />);
    expect(container.firstChild).toBeNull();
  });

  it("bypasses display when prefers-reduced-motion is active", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<Preloader />);
    expect(container.firstChild).toBeNull();
  });
});
