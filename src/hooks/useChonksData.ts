
import { useState, useEffect } from 'react';
import { ChonkNFT } from '@/types/chonk';
import { BASE_CHONKS } from '@/constants/chonks';
import { fetchNFTDataFromAPI } from '@/utils/nftApi';
import { processAPIData, createFallbackData } from '@/utils/chonkDataProcessor';

export const useChonksData = () => {
  const [chonks, setChonks] = useState<ChonkNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChonksData = async () => {
      try {
        console.log('Fetching real NFT data from Base blockchain...');
        let chonksData: ChonkNFT[] = [];
        
        // Fetch real Base NFTs from Alchemy + OpenSea
        try {
          const result = await fetchNFTDataFromAPI(BASE_CHONKS);
          console.log('Real NFT data fetched:', result.data?.length || 0, 'NFTs');
          
          chonksData = processAPIData(result);
        } catch (apiError) {
          console.log('Using fallback data due to API error:', apiError);
          chonksData = createFallbackData(BASE_CHONKS);
        }

        console.log('Final NFT data:', chonksData.length, 'total NFTs');
        setChonks(chonksData);
      } catch (err) {
        console.error('Error creating NFT data:', err);
        setError('Failed to load NFT data');
      } finally {
        setLoading(false);
      }
    };

    fetchChonksData();
  }, []);

  return { chonks, loading, error };
};
