import { useState, useEffect } from 'react';
import { fetchZoraPrices, extractContractFromZoraUrl, fetchGoneGreenMarketCaps } from '@/utils/zoraApi';

export const useZoraPrices = (nestedNFTs: any[]) => {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [marketCaps, setMarketCaps] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const isGoneGreen = (nft: any) =>
          nft?.collection === 'Gone Green' || /Gone\s+Green/i.test(nft?.name || '');

        // Contracts for Gone Green market caps via SDK only
        const goneGreenAddresses = Array.from(new Set(
          nestedNFTs
            .filter((nft: any) => isGoneGreen(nft) && (nft.contractAddress || nft.zoraUrl))
            .map((nft: any) => nft.contractAddress || extractContractFromZoraUrl(nft.zoraUrl))
            .filter(Boolean) as string[]
        ));

        if (goneGreenAddresses.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch market caps for Gone Green via Zora Coins SDK
        const sdkCaps = await fetchGoneGreenMarketCaps(goneGreenAddresses);

        // No general prices needed — only market caps per user request
        setPrices({});

        if (sdkCaps && Object.keys(sdkCaps).length > 0) {
          setMarketCaps(sdkCaps as Record<string, string>);
        }
      } catch (error) {
        // Suppress excessive error logging in development
        if (process.env.NODE_ENV !== 'development') {
          console.error('Error fetching Zora prices/caps:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [nestedNFTs]);

  return { prices, marketCaps, loading };
};
