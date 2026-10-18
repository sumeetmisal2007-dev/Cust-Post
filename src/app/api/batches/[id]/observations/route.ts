import { NextRequest, NextResponse } from "next/server";
import { batchStorageService } from "@/lib/services/batch-storage.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const newObs = await batchStorageService.addObservation({
      batchId: id,
      observedAt: body.observedAt || new Date().toISOString(),
      moisture: body.moisture || "ideal",
      odour: body.odour || "earthy",
      turned: Boolean(body.turned),
      wasteAddedKg: body.wasteAddedKg ? Number(body.wasteAddedKg) : undefined,
      wasteDataStatus: body.wasteDataStatus || "measured",
      temperatureC: body.temperatureC != null ? Number(body.temperatureC) : null,
      temperatureStatus: body.temperatureStatus || "unknown",
      pests: body.pests || "none",
      notes: body.notes || undefined,
    });

    return NextResponse.json({ success: true, observation: newObs }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const observations = await batchStorageService.getObservations(id);
    return NextResponse.json({ success: true, observations }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
