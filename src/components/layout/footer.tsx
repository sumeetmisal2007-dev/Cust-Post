import React from "react";
import Link from "next/link";
import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 text-sm text-muted">
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Sprout className="h-5 w-5 text-brand" aria-hidden="true" />
            <span>CUST-POST</span>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            A space-aware composting assistant helping urban households plan setups, log observations, and avoid common errors.
          </p>
        </div>

        {/* SDG 12 column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-ink text-sm">SDG 12 Alignment</h4>
          <p className="text-xs leading-relaxed text-muted">
            Aligned with UN SDG 12: Responsible Consumption and Production (Target 12.5). Waste diverted is reported from measured batches only.
          </p>
        </div>

        {/* Navigation column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-ink text-sm">Explore</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/setup" className="hover:text-action">
                Plan a New Setup
              </Link>
            </li>
            <li>
              <Link href="/plants" className="hover:text-action">
                Curated Plant Guides
              </Link>
            </li>
            <li>
              <Link href="/sources" className="hover:text-action">
                Sources & Methodology
              </Link>
            </li>
          </ul>
        </div>

        {/* Transparency column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-ink text-sm">Transparency & Care</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/sources" className="hover:text-action">
                Reviewer Provenance
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:text-action">
                Report Feedback
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-action">
                Privacy & Data Deletion
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted/70 gap-4">
        <p>&copy; {new Date().getFullYear()} Cust-Post. Concept PRD v0.1 • Nirman Lab student project.</p>
        <p>Zero black-box AI claims. Verified, deterministic rule guidance.</p>
      </div>
    </footer>
  );
}
