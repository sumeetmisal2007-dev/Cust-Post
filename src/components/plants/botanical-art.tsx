import React from "react";

interface BotanicalArtProps {
  slug: string;
  className?: string;
  size?: number;
}

export function BotanicalArt({ slug, className = "h-8 w-8 text-action", size = 32 }: BotanicalArtProps) {
  switch (slug) {
    case "tulsi":
    case "sweet-basil":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Central stem */}
          <path d="M16 28V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Top spire seeds */}
          <circle cx="16" cy="4" r="1.5" fill="currentColor" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" />
          {/* Left leaves */}
          <path
            d="M16 14C11 13 8 16 9 20C12 20 15 17 16 14Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Right leaves */}
          <path
            d="M16 11C21 10 24 13 23 17C20 17 17 14 16 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "mint":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 28V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Serrated mint leaf pairs */}
          <path
            d="M16 12C10 10 7 13 8 18C12 18 15 15 16 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 12C22 10 25 13 24 18C20 18 17 15 16 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 20C11 18 9 21 10 24C13 24 15 22 16 20Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 20C21 18 23 21 22 24C19 24 17 22 16 20Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "cherry-tomato":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Vine */}
          <path d="M4 10C10 8 18 8 28 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Calyx & tomato */}
          <path d="M16 8V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 11L16 13L19 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="20" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M14 17C14.5 16.5 15.5 16.5 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "chili":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 4C14 7 15 8 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Pepper cap */}
          <path d="M14 8C17 7 20 8 21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Curving chili body */}
          <path
            d="M14 9C12 14 13 22 18 26C21 28 23 27 22 25C21 21 21 16 21 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "spinach":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 28V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M16 5C10 6 7 11 8 18C9 23 13 25 16 26C19 25 23 23 24 18C25 11 22 6 16 5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 12C13 14 11 16 10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 14C19 16 21 18 22 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "strawberry":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Calyx */}
          <path d="M10 8L16 9L22 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Berry */}
          <path
            d="M10 9C7 14 8 20 12 25C14 27 18 27 20 25C24 20 25 14 22 9C18 10 14 10 10 9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="15" r="0.8" fill="currentColor" />
          <circle cx="18" cy="15" r="0.8" fill="currentColor" />
          <circle cx="16" cy="19" r="0.8" fill="currentColor" />
        </svg>
      );

    case "lemon":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Citrus shape */}
          <path
            d="M6 16C6 10 11 6 16 6C22 6 26 10 26 16C26 22 22 26 16 26C11 26 6 22 6 16Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M5 16H6M26 16H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Lemon segment arcs */}
          <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8V14M16 18V24M8 16H14M18 16H24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 28V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M16 14C11 13 8 16 9 20C12 20 15 17 16 14Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 10C21 9 24 12 23 16C20 16 17 13 16 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
