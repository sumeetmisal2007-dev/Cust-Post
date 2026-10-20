"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCw,
  Bell,
  BellRing,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Check,
} from "lucide-react";
import { CompostBatch, BatchObservation } from "@cust-post/backend";
import { batchStorageService } from "@cust-post/backend";
import { generateTurningCalendarIcs, downloadIcsFile } from "@/lib/utils/calendar-export";

interface TurnReminderBannerProps {
  batch: CompostBatch;
  observations: BatchObservation[];
  onTurnRecorded: () => void;
}

export function TurnReminderBanner({
  batch,
  observations,
  onTurnRecorded,
}: TurnReminderBannerProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [isLoggingTurn, setIsLoggingTurn] = useState(false);
  const [justTurned, setJustTurned] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Determine method-specific turning intervals (in days)
  const maxDaysWithoutTurn = batch.method === "vermicomposting" ? 7 : batch.method === "bokashi" ? 5 : 4;

  // Calculate days since last turn
  const lastTurnedObs = observations.find((o) => o.turned);
  const referenceDateStr = lastTurnedObs ? lastTurnedObs.observedAt : batch.startDate;
  const daysSinceTurn = Math.max(
    0,
    Math.floor((Date.now() - new Date(referenceDateStr).getTime()) / (1000 * 60 * 60 * 24))
  );

  const isOverdue = daysSinceTurn >= maxDaysWithoutTurn;
  const isDueSoon = daysSinceTurn === maxDaysWithoutTurn - 1;

  const handleQuickTurn = async () => {
    setIsLoggingTurn(true);
    try {
      await batchStorageService.addObservation({
        batchId: batch.id,
        observedAt: new Date().toISOString(),
        moisture: "ideal",
        odour: "earthy",
        turned: true,
        notes: "Quick aeration recorded via reminder banner.",
      });
      setJustTurned(true);
      onTurnRecorded();
      setTimeout(() => setJustTurned(false), 4000);
    } finally {
      setIsLoggingTurn(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification(`Cust-Post Reminder Active`, {
          body: `We'll remind you when "${batch.batchName}" is due for turning and aeration!`,
          icon: "/favicon.ico",
        });
      }
    } catch {
      // Graceful fallback if blocked
    }
  };

  const handleDownloadCalendar = () => {
    const icsContent = generateTurningCalendarIcs(batch.batchName, batch.method);
    const filename = `${batch.batchName.toLowerCase().replace(/\s+/g, "-")}-turning-reminder.ics`;
    downloadIcsFile(filename, icsContent);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border p-5 transition-all duration-300 shadow-xs ${
        isOverdue
          ? "border-rose-200 bg-gradient-to-r from-rose-50/90 via-surface to-amber-50/60"
          : isDueSoon
          ? "border-amber-200 bg-gradient-to-r from-amber-50/80 via-surface to-mint/30"
          : "border-emerald-200/80 bg-gradient-to-r from-mint/40 via-surface to-emerald-50/50"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Status & Guidance Message */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            {isOverdue ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
                <AlertTriangle className="h-3 w-3 text-rose-600" />
                <span>Aeration Overdue: {daysSinceTurn} Days Since Last Turn</span>
              </span>
            ) : isDueSoon ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <RotateCw className="h-3 w-3 text-amber-600" />
                <span>Turning Due Tomorrow</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Aeration On Track ({daysSinceTurn === 0 ? "Turned Today" : `${daysSinceTurn}d ago`})</span>
              </span>
            )}

            <span className="text-xs text-muted font-mono">
              Target Cadence: Every {maxDaysWithoutTurn} Days
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text leading-relaxed">
            {isOverdue
              ? "Microbes are exhausting oxygen in the core. Turn today to inject fresh air, revitalize decomposition, and stop sour anaerobic odor."
              : isDueSoon
              ? "Your pile is approaching its scheduled aeration cycle. Prepare to give it a brisk stir tomorrow."
              : "Oxygen levels in your pile are currently well-balanced for active aerobic thermophilic breakdown."}
          </p>
        </div>

        {/* Right: Quick Actions (1-Tap Turn, Web Push, Calendar Export) */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Quick Turn Button */}
          <button
            type="button"
            onClick={handleQuickTurn}
            disabled={isLoggingTurn || justTurned}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              justTurned
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-ink text-surface hover:bg-action active:scale-95"
            }`}
          >
            {justTurned ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Turn Recorded!</span>
              </>
            ) : (
              <>
                <RotateCw className={`h-3.5 w-3.5 text-emerald-300 ${isLoggingTurn ? "animate-spin" : ""}`} />
                <span>1-Tap Quick Turn</span>
              </>
            )}
          </button>

          {/* Web Push Notification Toggle */}
          {notificationPermission !== "unsupported" && notificationPermission !== "granted" ? (
            <button
              type="button"
              onClick={handleEnableNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border/80 bg-surface text-ink hover:bg-mint/40 transition-colors shadow-2xs"
              title="Receive browser alerts when pile needs turning"
            >
              <Bell className="h-3.5 w-3.5 text-action" />
              <span>Enable Browser Alerts</span>
            </button>
          ) : notificationPermission === "granted" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
              <BellRing className="h-3.5 w-3.5 text-emerald-600" />
              <span>Alerts Active</span>
            </span>
          ) : null}

          {/* Calendar Export */}
          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/80 bg-surface text-ink hover:bg-canvas transition-colors shadow-2xs"
            title="Download .ics schedule for Google / Apple Calendar"
          >
            <Calendar className="h-3.5 w-3.5 text-brand" />
            <span className="hidden sm:inline">Add to Calendar (.ics)</span>
            <span className="sm:hidden">Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
