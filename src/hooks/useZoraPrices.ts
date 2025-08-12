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

        // Contracts for general price fetch (keep existing behavior)
        const contractAddresses = Array.from(new Set(
          nestedNFTs
            .filter((nft: any) => nft.contractAddress || nft.zoraUrl)
            .map((nft: any) => nft.contractAddress || extractContractFromZoraUrl(nft.zoraUrl))
            .filter(Boolean) as string[]
        ));

        // Contracts for Gone Green market caps via SDK
        const goneGreenAddresses = Array.from(new Set(
          nestedNFTs
            .filter((nft: any) => isGoneGreen(nft) && (nft.contractAddress || nft.zoraUrl))
            .map((nft: any) => nft.contractAddress || extractContractFromZoraUrl(nft.zoraUrl))
            .filter(Boolean) as string[]
        ));

        if (contractAddresses.length === 0 && goneGreenAddresses.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch in parallel: SDK for Gone Green market caps and edge function for prices
        const [sdkCaps, result] = await Promise.all([
          goneGreenAddresses.length > 0 ? fetchGoneGreenMarketCaps(goneGreenAddresses) : Promise.resolve({}),
          contractAddresses.length > 0 ? fetchZoraPrices(contractAddresses).catch(() => null) : Promise.resolve(null),
        ]);

        // Set price map from edge function result if available
        if (result?.success && result.data) {
          const priceMap: Record<string, string> = {};
          result.data.forEach((item: any) => {
            const normalize = (val: any) => {
              if (val == null) return null;
              if (typeof val === 'string') {
                // Handle ETH values in wei
                if (/^(\d{11,})$/.test(val)) {
                  return (parseFloat(val) / 1e18).toFixed(6);
                }
                return val;
              }
              if (typeof val === 'number') return val.toFixed(6);
              return String(val);
            };
            const addr = item.contractAddress;
            const price = normalize(item.price);
            if (price) priceMap[addr] = price;
          });
          setPrices(priceMap);
        }

        // Set market caps strictly from SDK for Gone Green items
        if (sdkCaps && Object.keys(sdkCaps).length > 0) {
          setMarketCaps(sdkCaps as Record<string, string>);
        }
      } catch (error) {
        console.error('Error fetching Zora prices/caps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [nestedNFTs]);

  return { prices, marketCaps, loading };
};
