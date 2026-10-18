import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function GuestBanner() {
  return (
    <aside aria-label="Pilot notice" className="bg-mint/60 border-b border-border py-2 px-4 text-xs text-ink">
      <div className="max-w-content mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden="true" />
          <span>
            <strong>Prototype Pilot:</strong> No account required to plan your setup. Explore recommendations freely.
          </span>
        </div>
        <Link
          href="/sources"
          className="underline hover:text-action whitespace-nowrap text-muted hover:text-ink font-medium"
        >
          View rule methodology &rarr;
        </Link>
      </div>
    </aside>
  );
}
