import React from "react";
import Link from "next/link";
import { Globe, ArrowUpRight } from "lucide-react";

export function SdgStrip() {
  return (
    <section className="py-10 px-4 sm:px-6 max-w-content mx-auto w-full">
      <div className="rounded-panel border border-border bg-mint/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-1">
            <Globe className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-ink text-base sm:text-lg">
              Committed to UN SDG 12: Target 12.5
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              Substantially reduce waste generation through prevention, reduction, recycling, and reuse.
              Cust-Post counts waste diversion only when users weigh and record actual batch inputs.
            </p>
          </div>
        </div>

        <Link
          href="/sources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-action hover:underline whitespace-nowrap"
        >
          <span>View Source Methodology</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
