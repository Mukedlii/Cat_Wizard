"use client";

import { useEffect, useState } from "react";

type Nft = {
  tokenId: number;
  name: string;
  imageUrl: string | null;
  attributes: Array<{ trait_type?: string; value?: string }>;
  mintUrl: string | null;
};

function Card({ nft }: { nft: Nft }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{nft.name}</h2>
        <span style={{ opacity: 0.7 }}>#{nft.tokenId}</span>
      </div>

      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(0,0,0,0.04)",
          aspectRatio: "1 / 1",
          display: "grid",
          placeItems: "center",
        }}
      >
        {nft.imageUrl ? (
          <img
            src={nft.imageUrl}
            alt={nft.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ padding: 24, opacity: 0.7 }}>No imageUrl for this token.</div>
        )}
      </div>

      {nft.attributes?.length ? (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {nft.attributes.slice(0, 10).map((a, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.85)",
              }}
            >
              {(a.trait_type ?? "trait") + ": " + (a.value ?? "")}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Gallery() {
  const [nft, setNft] = useState<Nft | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canMint = Boolean(nft?.mintUrl);

  async function load(params: string) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/nft?${params}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load NFT");
      setNft(json);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("mode=random");
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>{process.env.NEXT_PUBLIC_APP_NAME ?? "Cat Wizard"}</h1>
          <div style={{ opacity: 0.7, marginTop: 4 }}>Browse 3333 NFTs by rarity & mint.</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            onClick={() => load("mode=random")}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}
          >
            🎲 Random
          </button>
          <button
            onClick={() => load(`tokenId=${nft?.tokenId ?? 1}&direction=prev`)}
            disabled={loading || !nft}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}
          >
            ◀ Prev
          </button>
          <button
            onClick={() => load(`tokenId=${nft?.tokenId ?? 1}&direction=next`)}
            disabled={loading || !nft}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}
          >
            Next ▶
          </button>

          {canMint ? (
            <a
              href={nft!.mintUrl!}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "black",
                color: "white",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🪄 Mint
            </a>
          ) : null}
        </div>
      </header>

      {err ? (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.15)",
          }}
        >
          {err}
        </div>
      ) : null}

      {loading && !nft ? <div style={{ padding: 24, opacity: 0.7 }}>Loading…</div> : nft ? <Card nft={nft} /> : null}

      <footer style={{ opacity: 0.65, fontSize: 12, paddingTop: 8 }}>
        Share this on Farcaster: <code>/embed</code>
      </footer>
    </div>
  );
}
