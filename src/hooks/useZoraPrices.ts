import { useState, useEffect } from 'react';
import { fetchZoraPrices, extractContractFromZoraUrl } from '@/utils/zoraApi';

export const useZoraPrices = (nestedNFTs: any[]) => {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [marketCaps, setMarketCaps] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Extract contract addresses from Zora URLs
        const contractAddresses = nestedNFTs
          .filter(nft => nft.zoraUrl)
          .map(nft => extractContractFromZoraUrl(nft.zoraUrl))
          .filter(Boolean) as string[];

        if (contractAddresses.length === 0) {
          setLoading(false);
          return;
        }

        const result = await fetchZoraPrices(contractAddresses);
        
        if (result?.success && result.data) {
          const priceMap: Record<string, string> = {};
          const marketCapMap: Record<string, string> = {};
          result.data.forEach((item: any) => {
            const normalize = (val: any) => {
              if (val == null) return null;
              if (typeof val === 'string') {
                // Handle USD market cap values like "686.44"
                if (val.includes('$') || !val.includes('.')) {
                  return val.replace('$', ''); // Remove $ sign but keep as is
                }
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
            const marketCap = normalize(item.marketCap);
            if (price) priceMap[addr] = price;
            if (marketCap) marketCapMap[addr] = marketCap;
          });
          setPrices(priceMap);
          setMarketCaps(marketCapMap);
        }
      } catch (error) {
        console.error('Error fetching Zora prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [nestedNFTs]);

  return { prices, marketCaps, loading };
};
