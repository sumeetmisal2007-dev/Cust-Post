import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GuestBanner } from "@/components/layout/guest-banner";
import { Preloader } from "@/components/ui/preloader";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";

export const metadata: Metadata = {
  title: "Cust-Post — Space-Aware Composting Assistant",
  description:
    "Plan and manage small-scale household composting suited to your real balcony, terrace, and waste constraints.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cust-Post",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-canvas text-text">
        <Preloader />
        <GuestBanner />
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <PwaRegistrar />
      </body>
    </html>
  );
}
