export function generateTurningCalendarIcs(batchName: string, method: string): string {
  const now = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatIcsDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const startStr = formatIcsDate(now);
  const uid = `turning-${Date.now()}@cust-post`;
  const cleanMethod = method.replace("_", " ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cust-Post//Compost Reminders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${startStr}`,
    `DTSTART:${startStr}`,
    `SUMMARY:Aerate Compost Batch: ${batchName}`,
    `DESCRIPTION:Turn and aerate your ${cleanMethod} compost pile to ensure aerobic microbial activity and prevent anaerobic odors. Log your observation on Cust-Post.`,
    "RRULE:FREQ=WEEKLY;INTERVAL=1",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time to turn your compost pile",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(filename: string, icsContent: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(link.href), 1000);
}
