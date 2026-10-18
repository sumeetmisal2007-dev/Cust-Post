import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cust-Post — Space-Aware Composting Assistant",
  description:
    "Plan and manage small-scale household composting suited to your real balcony, terrace, and waste constraints.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-canvas text-text">
        {children}
      </body>
    </html>
  );
}
