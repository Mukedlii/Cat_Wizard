"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Calls sdk.actions.ready() so the Farcaster client knows the mini app UI is ready.
 * Safe to run in a normal browser too (it will no-op / throw and we ignore).
 */
export function ClientReady() {
  useEffect(() => {
    sdk.actions.ready().catch(() => {});
  }, []);

  return null;
}
