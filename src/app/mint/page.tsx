'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { useMemo, useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ABI, CONTRACT_ADDRESS, MINT_PRICE_ETH } from '../../lib/contract';
import styles from './mint.module.css';

export default function MintPage() {
  const [shareOpened, setShareOpened] = useState(false);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  const shareText = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return [
      'I just minted a Cat Wizard 🧙🐈',
      '',
      '3333 supply • 0.00006 ETH • Base',
      'NFT card = $CATWIZ allocation + airdrop eligibility.',
      '',
      `Mint: ${base}/mint`,
    ].join('\n');
  }, []);

  const warpcastShareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = encodeURIComponent(shareText);
    const embed = encodeURIComponent(`${baseUrl}/embed`);
    return `https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`;
  }, [shareText]);

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
              <div className={styles.raffleTitle}>Mint</div>
              <ul className={styles.raffleList}>
                <li>Price: <b>{MINT_PRICE_ETH} ETH</b></li>
                <li>Supply: <b>{totalMinted?.toString() ?? '…'} / {maxSupply?.toString() ?? '…'}</b></li>
              </ul>
            </div>

            {!canMint && (
              <div className={styles.alert}>
                <b>Missing config:</b> set <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in Vercel.
              </div>
            )}

            <div className={styles.shareGate}>
              <div className={styles.shareTitle}>Step 1 — Share to unlock mint</div>
              <div className={styles.shareText}>{shareText}</div>
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
                  Post the text in Warpcast, come back, then tick “Posted”.
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
