"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, ShieldCheck, Sprout, Calendar, Tag } from "lucide-react";
import { ExternalSeedProduct, SeedCategory } from "@cust-post/backend";

interface SeedCardProps {
  product: ExternalSeedProduct;
}

const CATEGORY_STYLES: Record<SeedCategory, { label: string; badge: string }> = {
  vegetable: {
    label: "Vegetable",
    badge: "bg-amber-100/90 text-amber-950 border-amber-300",
  },
  fruit: {
    label: "Fruit",
    badge: "bg-rose-100/90 text-rose-950 border-rose-300",
  },
  herb: {
    label: "Herb",
    badge: "bg-emerald-100/90 text-emerald-950 border-emerald-300",
  },
  flower: {
    label: "Flower & Pollinator",
    badge: "bg-sky-100/90 text-sky-950 border-sky-300",
  },
};

export function SeedCard({ product }: SeedCardProps) {
  const [imageError, setImageError] = useState(false);
  const categoryMeta = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.herb;

  const verifiedDateFormatted = new Date(product.lastVerifiedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      data-testid={`seed-card-${product.id}`}
      className="group relative rounded-[22px] border border-border/80 bg-surface/90 backdrop-blur-sm p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between amc-card-smooth"
    >
      <div className="space-y-3.5">
        {/* Product Image */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border/60 bg-muted/20">
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={`${product.name} - ${product.variety}`}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-mint/20 text-action space-y-1">
              <Sprout className="h-8 w-8 text-action animate-amc-float" />
              <span className="text-xs font-semibold text-ink font-display">{product.name}</span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold shadow-xs ${categoryMeta.badge}`}
            >
              {categoryMeta.label}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-full bg-ink/75 backdrop-blur-sm text-white text-[10px] font-mono font-medium">
              {product.retailerName}
            </span>
          </div>
        </div>

        {/* Variety & Name */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink tracking-tight group-hover:text-action transition-colors">
              {product.name}
            </h3>
            {product.priceInr !== undefined ? (
              <span className="text-base font-extrabold text-ink font-display shrink-0">
                ₹{product.priceInr}
              </span>
            ) : (
              <span className="text-xs text-muted font-medium italic shrink-0">
                Price on site
              </span>
            )}
          </div>

          <p className="text-xs font-serif italic text-muted line-clamp-1">
            {product.variety}
          </p>

          {product.description && (
            <p className="text-xs text-text/80 leading-relaxed line-clamp-2 pt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Provenance and verification info */}
        <div className="pt-2 border-t border-border/60 space-y-1.5 text-[11px] text-muted">
          <div className="flex items-center justify-between">
            <span className="truncate max-w-[170px]">Source: {product.sourceAttribution}</span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>Verified {verifiedDateFormatted}</span>
            </span>
          </div>
        </div>
      </div>

      {/* External Link Action Button */}
      <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted">
          Sold by <strong className="text-ink">{product.retailerName}</strong>
        </span>

        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ink text-surface hover:bg-action text-xs font-semibold transition-colors shadow-2xs group-hover:shadow-md"
        >
          <span>View on Seller Website</span>
          <ExternalLink className="h-3.5 w-3.5 text-emerald-300" />
        </a>
      </div>
    </div>
  );
}
