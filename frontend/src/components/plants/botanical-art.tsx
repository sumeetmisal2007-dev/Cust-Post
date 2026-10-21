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

          <path d="M16 28V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          <circle cx="16" cy="4" r="1.5" fill="currentColor" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" />

          <path
            d="M16 14C11 13 8 16 9 20C12 20 15 17 16 14Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

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

          <path d="M4 10C10 8 18 8 28 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

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

          <path d="M14 8C17 7 20 8 21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

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

          <path d="M10 8L16 9L22 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

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
    case "dwarf-lemon":
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

          <path
            d="M6 16C6 10 11 6 16 6C22 6 26 10 26 16C26 22 22 26 16 26C11 26 6 22 6 16Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M5 16H6M26 16H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8V14M16 18V24M8 16H14M18 16H24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case "curry-leaves":
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

          <path d="M16 28V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 7C13 5 11 7 12 9C14 9 15 8 16 7Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 7C19 5 21 7 20 9C18 9 17 8 16 7Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 13C12 11 10 13 11 16C13 16 15 15 16 13Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 13C20 11 22 13 21 16C19 16 17 15 16 13Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 19C11 17 9 20 10 23C13 23 15 21 16 19Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 19C21 17 23 20 22 23C19 23 17 21 16 19Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );

    case "ajwain-leaves":
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
            d="M16 6C10 5 7 10 8 16C10 18 13 17 16 15C19 17 22 18 24 16C25 10 22 5 16 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 15V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
        </svg>
      );

    case "okra-bhindi":
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
          <path d="M11 9L16 7L21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

          <path
            d="M11 9C12 16 13 23 16 29C19 23 20 16 21 9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 8V27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case "brinjal-baingan":
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

          <path d="M16 3C15 6 15 7 16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          <path
            d="M10 11L13 12L16 9L19 12L22 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M11 11C8 16 9 22 13 26C15 28 17 28 19 26C23 22 24 16 21 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "red-amaranth":
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

          <path d="M16 28V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M16 6C11 8 8 13 9 19C12 20 15 18 16 16C17 18 20 20 23 19C24 13 21 8 16 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 16V9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13 14C14 15 15 15 16 15" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );

    case "bitter-gourd":
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

          <path d="M16 3C18 5 19 7 16 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

          <path
            d="M16 8C12 11 11 18 12 23C13 26 15 28 16 29C17 28 19 26 20 23C21 18 20 11 16 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="14" r="0.8" fill="currentColor" />
          <circle cx="18" cy="16" r="0.8" fill="currentColor" />
          <circle cx="15" cy="20" r="0.8" fill="currentColor" />
          <circle cx="17" cy="24" r="0.8" fill="currentColor" />
        </svg>
      );

    case "capsicum":
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

          <path d="M16 4C15 6 15 7 16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          <path
            d="M11 9C8 13 8 21 10 25C13 28 15 27 16 26C17 27 19 28 22 25C24 21 24 13 21 9C19 10 17 9 16 9C15 9 13 10 11 9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 9V26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case "guava":
    case "dwarf-guava":
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

          <path d="M10 5L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M10 5C6 7 6 11 9 12C12 12 13 9 10 5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="2" />

          <path d="M16 26L18 24L20 26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
