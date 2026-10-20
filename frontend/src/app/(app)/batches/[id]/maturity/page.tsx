"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompostBatch } from "@cust-post/backend";
import { batchStorageService } from "@cust-post/backend";
import { MaturityChecklist } from "@/components/compost/maturity-checklist";
import { BatchCompletionModal } from "@/components/compost/batch-completion-modal";

export default function MaturityChecklistPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const [batch, setBatch] = useState<CompostBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    batchStorageService.getBatchById(id).then((b) => {
      setBatch(b);
      setLoading(false);
    });
  }, [id]);

  const handleConfirmCompletion = async () => {
    if (!batch) return;
    try {
      setIsSubmitting(true);
      const nowIso = new Date().toISOString();

      await batchStorageService.updateBatch(batch.id, {
        status: "completed",
        completedAt: nowIso,
      });

      await batchStorageService.addObservation({
        batchId: batch.id,
        observedAt: nowIso,
        moisture: "ideal",
        odour: "earthy",
        turned: false,
        notes: "Batch completed: all 4 physical maturity criteria verified by user.",
      });

      setIsModalOpen(false);
      router.push(`/batches/${batch.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center text-muted text-sm">
        Loading maturity verification...
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
        <span className="text-xs font-mono text-muted uppercase">Harvest Verification</span>
      </div>

      {/* Main checklist */}
      <MaturityChecklist
        batchId={batch.id}
        onComplete={() => setIsModalOpen(true)}
      />

      {/* Celebratory Completion Modal */}
      <BatchCompletionModal
        isOpen={isModalOpen}
        batchName={batch.batchName}
        onConfirm={handleConfirmCompletion}
        onClose={() => setIsModalOpen(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
