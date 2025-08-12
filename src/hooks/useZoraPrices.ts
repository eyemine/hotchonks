import { useState, useEffect } from 'react';
import { fetchZoraPrices, extractContractFromZoraUrl } from '@/utils/zoraApi';

export const useZoraPrices = (nestedNFTs: any[]) => {
  const [prices, setPrices] = useState<Record<string, string>>({});
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
        
        if (result.success && result.data) {
          const priceMap: Record<string, string> = {};
          result.data.forEach((item: any) => {
            if (item.price) {
              // Convert price to ETH if it's in wei
              const priceInEth = typeof item.price === 'string' && item.price.length > 10
                ? (parseFloat(item.price) / 1e18).toFixed(6)
                : item.price;
              priceMap[item.contractAddress] = priceInEth;
            }
          });
          setPrices(priceMap);
        }
      } catch (error) {
        console.error('Error fetching Zora prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [nestedNFTs]);

  return { prices, loading };
};