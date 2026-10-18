import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Sparkles, ShieldCheck, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-content mx-auto w-full">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint text-action text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Space-aware composting for beginners</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink">
          Make room for better soil.
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
          Choose a composting setup tailored to your balcony space, container, and food scraps.
          Track real batches with zero black-box guesswork.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/setup">
              Start a setup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/plants">Learn plant care</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <Card>
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-action mb-2" />
              <CardTitle>Screen Your Container</CardTitle>
              <CardDescription>
                Validate ventilation, drainage, material, and geometric volume before starting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="estimated" label="Calculates geometric volume" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ClipboardList className="h-8 w-8 text-action mb-2" />
              <CardTitle>Track Real Batches</CardTitle>
              <CardDescription>
                Record moisture, odor, turning, and scrap weight over time with dated logs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="measured" label="Direct measured weights" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-action mb-2" />
              <CardTitle>Evidence-First Advice</CardTitle>
              <CardDescription>
                Troubleshoot odor and moisture with reviewed rules and cited literature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="user_reported" label="Cites EPA & MCGM guides" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
