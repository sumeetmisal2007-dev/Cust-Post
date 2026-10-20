"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompostBatch } from "@cust-post/backend";
import { batchStorageService } from "@cust-post/backend";
import {
  troubleshootCompost,
  TroubleshootingInputs,
  TroubleshootingResolution,
} from "@cust-post/backend";
import { SymptomSelector } from "@/components/troubleshoot/symptom-selector";
import { ResolutionView } from "@/components/troubleshoot/resolution-view";

export default function TroubleshootPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const [batch, setBatch] = useState<CompostBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInputs, setSelectedInputs] = useState<Omit<
    TroubleshootingInputs,
    "method"
  > | null>(null);
  const [resolution, setResolution] = useState<TroubleshootingResolution | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!id) return;
    batchStorageService.getBatchById(id).then((b) => {
      setBatch(b);
      setLoading(false);
    });
  }, [id]);

  const handleSelectSymptom = (inputs: Omit<TroubleshootingInputs, "method">) => {
    setSelectedInputs(inputs);
    if (batch) {
      const res = troubleshootCompost({
        ...inputs,
        method: batch.method,
      });
      setResolution(res);
    }
  };

  const handleApplyLog = async () => {
    if (!batch || !resolution || !selectedInputs) return;

    try {
      setIsApplying(true);

      const willTurn = resolution.suggestedLogAction.toLowerCase().includes("turn");
      const moisture =
        selectedInputs.symptom === "excess_moisture_soggy"
          ? "too_wet"
          : selectedInputs.symptom === "too_dry_no_breakdown"
          ? "dry"
          : "ideal";
      const odour =
        selectedInputs.symptom === "foul_odor_ammonia_rot"
          ? "sour"
          : "none";

      await batchStorageService.addObservation({
        batchId: batch.id,
        observedAt: new Date().toISOString(),
        moisture,
        odour,
        turned: willTurn,
        notes: `Troubleshoot applied: ${resolution.symptomTitle}. Corrective action: ${resolution.suggestedLogAction}`,
      });

      router.push(`/batches/${batch.id}`);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center text-muted text-sm">
        Loading troubleshooter...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Batch Not Found</h2>
        <Link href="/setup">
          <Button size="lg">Return to Setup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 space-y-8">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/batches/${batch.id}`}
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>Back to {batch.batchName}</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Guided Troubleshooting</span>
      </div>

      <div className="space-y-2 text-left">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
          <Wrench className="h-6 w-6 text-action" />
          <span>Interactive Troubleshooting Assistant</span>
        </h1>
        <p className="text-sm text-muted">
          Diagnose bin issues with verified open literature. Zero guesswork or generic AI advice.
        </p>
      </div>

      {/* Symptom Selection */}
      <SymptomSelector
        selectedSymptom={selectedInputs?.symptom || null}
        onSelectSymptom={handleSelectSymptom}
      />

      {/* Resolution Details */}
      {resolution && (
        <ResolutionView
          resolution={resolution}
          onApplyLog={handleApplyLog}
          isApplying={isApplying}
        />
      )}
    </div>
  );
}
