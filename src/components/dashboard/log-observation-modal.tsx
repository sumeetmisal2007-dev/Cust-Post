"use client";

import React, { useState } from "react";
import { X, Droplets, Wind, RotateCw, PlusCircle, Scale, Thermometer, Bug, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoistureLevel, OdourType, PestType, DataStatus } from "@/types/domain";
import { batchStorageService } from "@/lib/services/batch-storage.service";
import { cn } from "@/lib/utils";

interface LogObservationModalProps {
  isOpen: boolean;
  batchId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function LogObservationModal({
  isOpen,
  batchId,
  onClose,
  onSaved,
}: LogObservationModalProps) {
  const [observedAt, setObservedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [moisture, setMoisture] = useState<MoistureLevel>("ideal");
  const [odour, setOdour] = useState<OdourType>("earthy");
  const [turned, setTurned] = useState(false);
  const [wasteKg, setWasteKg] = useState<string>("");
  const [wasteStatus, setWasteStatus] = useState<DataStatus>("measured");
  const [temperatureC, setTemperatureC] = useState<string>("");
  const [noTemp, setNoTemp] = useState(true);
  const [pests, setPests] = useState<PestType>("none");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const parsedWaste = wasteKg ? parseFloat(wasteKg) : undefined;
      const parsedTemp = !noTemp && temperatureC ? parseFloat(temperatureC) : null;

      await batchStorageService.addObservation({
        batchId,
        observedAt: new Date(observedAt).toISOString(),
        moisture,
        odour,
        turned,
        wasteAddedKg: parsedWaste && !isNaN(parsedWaste) ? parsedWaste : undefined,
        wasteDataStatus: parsedWaste ? wasteStatus : undefined,
        temperatureC: parsedTemp,
        temperatureStatus: parsedTemp != null ? "measured" : "unknown",
        pests,
        notes: notes.trim() || undefined,
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record observation";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-obs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="log-obs-title" className="font-display text-lg font-bold text-ink">
              Log Batch Observation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-muted hover:text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date & Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Observation Timestamp</label>
            <Input
              type="datetime-local"
              required
              value={observedAt}
              onChange={(e) => setObservedAt(e.target.value)}
            />
          </div>

          {/* Moisture Check */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-action" />
              <span>Moisture Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "dry", label: "Dry", desc: "Leaves crumble, dusty" },
                { id: "ideal", label: "Ideal", desc: "Damp sponge, no dripping" },
                { id: "too_wet", label: "Too Wet", desc: "Soggy or pooled liquid" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setMoisture(opt.id as MoistureLevel)}
                  className={cn(
                    "p-3 rounded-card border text-left transition-all min-h-[48px]",
                    moisture === opt.id
                      ? "border-action bg-surface ring-2 ring-action/20 shadow-xs font-bold text-ink"
                      : "border-border bg-surface hover:bg-canvas text-muted"
                  )}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[11px] mt-0.5 opacity-80">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Odour Check */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-action" />
              <span>Odour Check</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "earthy", label: "Earthy", desc: "Fresh forest" },
                { id: "none", label: "None / Mild", desc: "Neutral" },
                { id: "sour", label: "Sour", desc: "Vinegary / rotten" },
                { id: "ammonia", label: "Ammonia", desc: "Sharp / pungent" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setOdour(opt.id as OdourType)}
                  className={cn(
                    "p-2.5 rounded-card border text-left transition-all min-h-[48px]",
                    odour === opt.id
                      ? "border-action bg-surface ring-2 ring-action/20 shadow-xs font-bold text-ink"
                      : "border-border bg-surface hover:bg-canvas text-muted"
                  )}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-80">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pile Turning Toggle */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-3 p-3 rounded-card border border-border bg-surface cursor-pointer hover:bg-canvas">
              <input
                type="checkbox"
                checked={turned}
                onChange={(e) => setTurned(e.target.checked)}
                className="h-4 w-4 rounded text-action focus:ring-action"
              />
              <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                <RotateCw className="h-4 w-4 text-action" />
                <span>Turned / mixed pile today</span>
              </div>
            </label>
          </div>

          {/* Waste Addition */}
          <div className="pt-2 border-t border-border space-y-3">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-action" />
              <span>Add Organic Waste (Optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 1.5"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(e.target.value)}
                  unit="kg"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setWasteStatus("measured")}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-input border transition-colors flex-1 sm:flex-none",
                    wasteStatus === "measured"
                      ? "bg-action/10 text-action border-action"
                      : "bg-surface border-border text-muted"
                  )}
                >
                  Measured (Scale)
                </button>
                <button
                  type="button"
                  onClick={() => setWasteStatus("estimated")}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-input border transition-colors flex-1 sm:flex-none",
                    wasteStatus === "estimated"
                      ? "bg-accent/20 text-ink border-accent"
                      : "bg-surface border-border text-muted"
                  )}
                >
                  Estimated
                </button>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5 text-brand" />
                <span>Core Pile Temperature</span>
              </label>
              <label className="text-xs text-muted flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noTemp}
                  onChange={(e) => setNoTemp(e.target.checked)}
                  className="rounded text-action"
                />
                <span>Not measured / No thermometer</span>
              </label>
            </div>
            {!noTemp && (
              <Input
                type="number"
                step="0.5"
                placeholder="e.g. 52"
                value={temperatureC}
                onChange={(e) => setTemperatureC(e.target.value)}
                unit="°C"
              />
            )}
          </div>

          {/* Pests */}
          <div className="pt-2 border-t border-border space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Bug className="h-3.5 w-3.5 text-rose-500" />
              <span>Pests or Larvae Observed</span>
            </label>
            <select
              value={pests}
              onChange={(e) => setPests(e.target.value as PestType)}
              className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            >
              <option value="none">None observed</option>
              <option value="fruit_flies">Fruit flies / Gnats</option>
              <option value="maggots">Soldier fly maggots</option>
              <option value="ants">Ants</option>
              <option value="cockroaches">Cockroaches</option>
              <option value="rodents">Rodent signs</option>
            </select>
          </div>

          {/* Notes */}
          <div className="pt-2 border-t border-border space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-action" />
              <span>Observation Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Added handful of shredded cardboard, mixed upper layer..."
              className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Observation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
