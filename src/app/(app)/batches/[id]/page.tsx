"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompostBatch, BatchObservation } from "@/types/domain";
import { batchStorageService } from "@/lib/services/batch-storage.service";
import { BatchHeader } from "@/components/dashboard/batch-header";
import { TurnReminderBanner } from "@/components/dashboard/turn-reminder-banner";
import { MetricSummary } from "@/components/dashboard/metric-summary";
import { BatchTimeline } from "@/components/dashboard/batch-timeline";
import { LogObservationModal } from "@/components/dashboard/log-observation-modal";

export default function BatchDashboardPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [batch, setBatch] = useState<CompostBatch | null>(null);
  const [observations, setObservations] = useState<BatchObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadBatchData = React.useCallback(async () => {
    if (!id) return;
    try {
      const fetchedBatch = await batchStorageService.getBatchById(id);
      setBatch(fetchedBatch);
      if (fetchedBatch) {
        const fetchedObs = await batchStorageService.getObservations(id);
        setObservations(fetchedObs);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBatchData();
  }, [loadBatchData]);

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center text-muted text-sm">
        Loading batch dashboard...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-ink">Batch Not Found</h2>
          <p className="text-sm text-muted">
            The batch you are looking for may have been removed or was created in a different browser session.
          </p>
        </div>
        <div>
          <Link href="/setup">
            <Button size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create New Batch</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 space-y-8">
      {/* Batch Header */}
      <BatchHeader batch={batch} />

      {/* Dynamic Aeration & Turn Reminder Banner (Feature 2) */}
      <TurnReminderBanner
        batch={batch}
        observations={observations}
        onTurnRecorded={loadBatchData}
      />

      {/* Metric Summary & Quick Actions */}
      <MetricSummary
        batch={batch}
        observations={observations}
        onLogObservation={() => setIsLogModalOpen(true)}
      />

      {/* Observation Activity Timeline (Task 23) */}
      <BatchTimeline
        observations={observations}
        onLogFirst={() => setIsLogModalOpen(true)}
      />

      {/* Log Observation Modal (Task 23) */}
      <LogObservationModal
        isOpen={isLogModalOpen}
        batchId={batch.id}
        onClose={() => setIsLogModalOpen(false)}
        onSaved={loadBatchData}
      />
    </div>
  );
}
