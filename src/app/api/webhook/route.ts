import { NextRequest, NextResponse } from "next/server";

// Optional webhook endpoint (for future use). For now, just ACK.
export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
