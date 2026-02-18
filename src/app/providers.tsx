'use client';

import { ReactNode, useEffect } from 'react';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sdk } from '@farcaster/miniapp-sdk';

// RainbowKit v2 uses TanStack Query.
const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID';

const config = getDefaultConfig({
  appName: 'Cat Wizard',
  projectId,
  chains: [base],
});

function MiniAppReady() {
  useEffect(() => {
    // When running inside a Farcaster client, this hides the splash screen.
    // In a normal browser, it may throw; ignore.
    sdk.actions.ready().catch(() => {});
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <MiniAppReady />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
