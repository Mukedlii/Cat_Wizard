import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";
import { renderFrameHtml } from "@/app/lib/renderFrame";

export async function GET() {
  const sb = supabaseServer();
  const homeUrl = process.env.NEXT_PUBLIC_APP_HOME_URL ?? "https://example.com";

  const SUPPLY = 3333;
  const tokenId = 1 + Math.floor(Math.random() * SUPPLY);

  const { data } = await sb
    .from("nfts")
    .select("token_id,image_url,name,metadata,mint_url")
    .eq("token_id", tokenId)
    .maybeSingle();

  const meta = (data?.metadata ?? {}) as any;
  const imageUrl = data?.image_url ?? meta.image ?? meta.image_url ?? `${homeUrl}/cover.png`;
  const title = data?.name ?? meta.name ?? `Cat Wizard #${tokenId}`;
  const mintUrl = data?.mint_url ?? meta.external_url ?? process.env.NEXT_PUBLIC_DEFAULT_MINT_URL ?? `${homeUrl}/mint`;

  const html = renderFrameHtml({
    title,
    imageUrl,
    postUrl: `${homeUrl}/api/frame`,
    aspectRatio: "1:1",
    state: { tokenId },
    buttons: [
      { label: "🎲 Random", action: "post" },
      { label: "◀ Prev", action: "post" },
      { label: "Next ▶", action: "post" },
      { label: "🪄 Mint", action: "link", target: mintUrl },
    ],
  });

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
  });
}
