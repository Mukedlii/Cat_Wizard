'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { useMemo, useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ABI, CONTRACT_ADDRESS, MINT_PRICE_ETH } from '../lib/contract';
import styles from './mint/mint.module.css';

export default function Home() {
  const [shareOpened, setShareOpened] = useState(false);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  const shareText = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return [
      'I just minted a Cat Wizard 🧙🐈',
      '',
      'This is a Farcaster-native game project. Your NFT card comes with $CATWIZ allocation + airdrop eligibility.',
      '',
      `Mint yours: ${base}/mint`,
    ].join('\n');
  }, []);

  const warpcastShareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = encodeURIComponent(
      [
        'I just minted a Cat Wizard 🧙🐈',
        '',
        'Farcaster-native game project. NFT card = $CATWIZ allocation + airdrop eligibility.',
        '',
        `Mint yours: ${baseUrl}/mint`,
      ].join('\n')
    );
    const embed = encodeURIComponent(`${baseUrl}/mint`);
    return `https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`;
  }, []);

  const { data: totalMinted } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'totalMinted',
    query: { enabled: Boolean(CONTRACT_ADDRESS) },
  });

  const { data: maxSupply } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'MAX_SUPPLY',
    query: { enabled: Boolean(CONTRACT_ADDRESS) },
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const canMint = Boolean(CONTRACT_ADDRESS);
  const shareGateOk = shareOpened && shareConfirmed;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <h2 className={styles.brandTitle}>Cat Wizard</h2>
            <p className={styles.brandSub}>fixed price mint on Base</p>
          </div>
          <ConnectButton />
        </div>

        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.raffle}>
              <div className={styles.raffleTitle}>About</div>
              <ul className={styles.raffleList}>
                <li><b>Cat Wizard</b> is a Farcaster-native game project</li>
                <li>Minting an NFT gives you an in-game card with <b>$CATWIZ allocation</b></li>
                <li>Holding your card will be required for <b>airdrop eligibility</b> + future drops/rewards</li>
                <li>Token will be used inside the game once it goes live</li>
                <li>Price: <b>{MINT_PRICE_ETH} ETH</b></li>
                <li>Supply: <b>3333</b></li>
              </ul>
            </div>

            {!canMint && (
              <div className={styles.alert}>
                <b>Missing config:</b> set <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in Vercel.
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Supply</div>
                <div className={styles.statValue}>
                  {totalMinted?.toString() ?? '…'} / {maxSupply?.toString() ?? '…'}
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Status</div>
                <div className={styles.statValue}>{canMint ? 'Live' : 'Config missing'}</div>
              </div>
            </div>

            <div className={styles.badgeRow}>
              <span className={styles.badge}>Fixed price</span>
              <span className={styles.badge}>Fixed supply</span>
              <span className={styles.badge}>Base</span>
            </div>

            <div className={styles.shareGate}>
              <div className={styles.shareTitle}>Step 1 — Share to unlock mint</div>
              <div className={styles.shareText}>{shareText || 'I minted a Lucky Ticket…'}</div>
              <div className={styles.shareActions}>
                <a
                  className={styles.shareBtn}
                  href={warpcastShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShareOpened(true)}
                >
                  Open Warpcast (share)
                </a>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={shareConfirmed}
                    onChange={(e) => setShareConfirmed(e.target.checked)}
                    disabled={!shareOpened}
                  />
                  Posted ✅ (I’m back)
                </label>
              </div>
              {!shareGateOk && (
                <div className={styles.shareHint}>
                  Click mint → it opens Warpcast with the text. Post it, come back, then tick “Posted”.
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                disabled={!canMint || isPending || isConfirming}
                onClick={() => {
                  if (!shareGateOk) {
                    setShareOpened(true);
                    window.open(warpcastShareUrl, '_blank', 'noopener,noreferrer');
                    return;
                  }

                  writeContract({
                    abi: ABI,
                    address: CONTRACT_ADDRESS,
                    functionName: 'mint',
                    args: [BigInt(1)],
                    value: parseEther(MINT_PRICE_ETH),
                  });
                }}
              >
                {!shareGateOk
                  ? 'Share & recast first'
                  : isPending
                    ? 'Confirm in wallet…'
                    : isConfirming
                      ? 'Minting…'
                      : 'Mint now'}
              </button>
            </div>

            {txHash && (
              <div className={styles.small}>
                Tx:{' '}
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer">
                  {txHash}
                </a>
              </div>
            )}

            {isSuccess && <div className={styles.success}>Mint success. Check your wallet / OpenSea.</div>}
            {error && <div className={styles.error}>{String(error.message || error)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
