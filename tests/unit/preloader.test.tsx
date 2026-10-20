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
    expect(screen.getByRole("heading", { name: /cust-post/i })).toBeInTheDocument();
    expect(screen.getByText(/space-aware composting/i)).toBeInTheDocument();
  });

  it("completes animation sequence and smoothly transitions to login interface", () => {
    render(<Preloader durationMs={1000} />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByText(/sign in or sync account/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue as guest/i })).toBeInTheDocument();
  });

  it("allows proceeding as guest and persists to sessionStorage", () => {
    render(<Preloader durationMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    const guestButton = screen.getByRole("button", { name: /continue as guest/i });
    fireEvent.click(guestButton);

    act(() => {
      vi.advanceTimersByTime(600);
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
