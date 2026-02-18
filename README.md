# Cat Wizard – Farcaster mint (Base)

Next.js app (Vercel) a **Cat Wizard** NFT kollekció minteléséhez Farcasterből.

## Fix paraméterek
- Chain: **Base**
- Contract: `0x70ECd2CbA2eE3B3da02Bc5F76087556ee458D1A9`
- Max supply: **3333**
- Mint price: **0.00006 ETH**
- Payout: `0xa782922Ff9c54F4264FD049189eC66940f528Eb0`
- Share/recast gate: a UI-ban **1× share** után enged mintelni (checkbox flow).

## Local dev
```bash
cd cat_wizard
npm i
cp .env.example .env
npm run dev
```

## Vercel deploy
1) Import this repo in Vercel
2) Root: repo root
3) Env vars (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_BASE_URL=https://<your-domain>`
   - `NEXT_PUBLIC_WC_PROJECT_ID=...`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS=0x70ECd2CbA2eE3B3da02Bc5F76087556ee458D1A9`
4) Deploy

## Farcaster domain verify
Domain váltásnál a `.well-known/farcaster.json`-t **újra kell generálni** Warpcast Developer/Mini Apps felületen.
- File path: `public/.well-known/farcaster.json`

> A Warpcast által adott JSON-t teljes egészében cseréld le.
