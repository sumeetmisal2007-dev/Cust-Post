"use client";

import React, { useState } from "react";
import {
  X,
  Droplets,
  Wind,
  RotateCw,
  PlusCircle,
  Scale,
  Thermometer,
  Bug,
  FileText,
  Camera,
  Trash2,
} from "lucide-react";
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

function compressImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsCompressing(true);
      setError(null);
      const compressedDataUrl = await compressImage(file);
      setImageUrl(compressedDataUrl);
    } catch {
      setError("Could not process selected image. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

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
        imageUrl: imageUrl || undefined,
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Observed At Date-time */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Observation Date & Time</label>
            <input
              type="datetime-local"
              value={observedAt}
              onChange={(e) => setObservedAt(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            />
          </div>

          {/* Moisture Check */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-action" />
              <span>Moisture Level (Squeeze Test)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { val: "dry", label: "Dry", desc: "Dusty, leaves crumble" },
                  { val: "ideal", label: "Ideal", desc: "Damp sponge, few drops" },
                  { val: "too_wet", label: "Too Wet", desc: "Water pools, soggy" },
                ] as const
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setMoisture(opt.val)}
                  className={cn(
                    "p-2.5 rounded-card border text-left transition-all",
                    moisture === opt.val
                      ? "border-action bg-action/10 text-action font-semibold shadow-2xs"
                      : "border-border bg-surface text-text hover:bg-canvas"
                  )}
                >
                  <span className="block text-xs font-bold capitalize">{opt.label}</span>
                  <span className="block text-[10px] text-muted leading-tight mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Odour Check */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-action" />
              <span>Odour Check</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { val: "earthy", label: "Earthy / Forest" },
                  { val: "none", label: "None / Mild" },
                  { val: "sour", label: "Sour / Vinegary" },
                  { val: "ammonia", label: "Ammonia / Sharp" },
                ] as const
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setOdour(opt.val)}
                  className={cn(
                    "p-2 rounded-card border text-center transition-all",
                    odour === opt.val
                      ? "border-action bg-action/10 text-action font-semibold"
                      : "border-border bg-surface text-text hover:bg-canvas"
                  )}
                >
                  <span className="block text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Turning / Aeration */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={turned}
                onChange={(e) => setTurned(e.target.checked)}
                className="rounded text-action focus:ring-action"
              />
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 text-action" />
                <span>Turned / Mixed pile today (aeration)</span>
              </span>
            </label>
          </div>

          {/* Waste Addition */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-action" />
              <span>Waste Added Today (Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={wasteKg}
                onChange={(e) => setWasteKg(e.target.value)}
                unit="kg"
              />
              <select
                value={wasteStatus}
                onChange={(e) => setWasteStatus(e.target.value as DataStatus)}
                className="px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
                disabled={!wasteKg}
              >
                <option value="measured">Directly Weighed (Kitchen Scale)</option>
                <option value="estimated">Estimated (Container/Volume based)</option>
              </select>
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

          {/* Photo Journal Attachment */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-xs font-semibold text-ink flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-action" />
                <span>Pile Photo Journal (Optional)</span>
              </span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="text-[11px] text-rose-600 hover:underline inline-flex items-center gap-0.5"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Photo</span>
                </button>
              )}
            </label>

            {imageUrl ? (
              <div className="relative rounded-card overflow-hidden border border-border bg-surface p-2.5 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Observation pile preview"
                  className="h-20 w-20 rounded-md object-cover border border-border shrink-0 shadow-2xs"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-ink">Photo attached</p>
                  <p className="text-[11px] text-muted">Ready to save into your batch visual timeline</p>
                  <label className="text-[11px] text-action hover:underline cursor-pointer font-medium inline-block">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoSelect}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-card bg-surface/60 hover:bg-surface cursor-pointer transition-colors text-center group">
                <Camera className="h-6 w-6 text-muted group-hover:text-action transition-colors mb-1.5" />
                <span className="text-xs font-medium text-ink">
                  {isCompressing ? "Processing photo..." : "Take a photo or upload from device"}
                </span>
                <span className="text-[10px] text-muted mt-0.5">
                  JPG, PNG, or camera capture (auto-optimized)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  disabled={isCompressing}
                  className="sr-only"
                />
              </label>
            )}
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
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting || isCompressing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCompressing}>
              {isSubmitting ? "Recording..." : "Record Observation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
