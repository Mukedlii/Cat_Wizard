import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";

/**
 * Expected table (example):
 *  - public.nfts(token_id int primary key, image_url text, name text, attributes jsonb, mint_url text, metadata jsonb)
 *
 * Adjust the select() to match your schema.
 */
export async function GET(req: NextRequest) {
  const sb = supabaseServer();
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("mode"); // "random" | null
  const tokenIdParam = searchParams.get("tokenId");
  const direction = searchParams.get("direction"); // "next" | "prev" | null

  const SUPPLY = 3333;

  let tokenId: number | null = tokenIdParam ? Number(tokenIdParam) : null;
  if (tokenIdParam && (tokenId === null || !Number.isFinite(tokenId) || tokenId <= 0)) tokenId = null;

  if (mode === "random" || tokenId === null) {
    tokenId = 1 + Math.floor(Math.random() * SUPPLY);
  } else if (direction === "next") {
    tokenId = tokenId >= SUPPLY ? 1 : tokenId + 1;
  } else if (direction === "prev") {
    tokenId = tokenId <= 1 ? SUPPLY : tokenId - 1;
  }

  const { data, error } = await sb
    .from("nfts")
    .select("token_id,image_url,name,attributes,mint_url,metadata")
    .eq("token_id", tokenId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "NFT not found", tokenId }, { status: 404 });

  const meta = (data.metadata ?? {}) as any;
  const imageUrl = data.image_url ?? meta.image ?? meta.image_url ?? null;

  // By default, Mint button goes to onchain mint page.
  const mintFallback = `${process.env.NEXT_PUBLIC_APP_HOME_URL ?? ""}/mint`;

  const mintUrl =
    data.mint_url ??
    meta.external_url ??
    process.env.NEXT_PUBLIC_DEFAULT_MINT_URL ??
    (mintFallback || null);

  return NextResponse.json({
    tokenId: data.token_id,
    name: data.name ?? meta.name ?? `Cat Wizard #${data.token_id}`,
    imageUrl,
    attributes: data.attributes ?? meta.attributes ?? [],
    mintUrl,
  });
}
