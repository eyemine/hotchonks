import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoneGreenNFT {
  tokenId: string;
  chonkId: string;
  name: string;
  image: string;
  collection: string;
  zoraUrl: string;
  contractAddress: string;
  error?: string;
}

export const useGoneGreenUpdater = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGoneGreenMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get all the chonk IDs that have Gone Green NFTs
      const chonkIds = ['585', '586', '588', '599', '601', '606', '662', '663', '665', '672', '676', '678', '680', '681', '693', '697', '700', '972', '9534'];

      const { data, error: functionError } = await supabase.functions.invoke('alchemy-api', {
        body: {
          action: 'getGoneGreenMetadata',
          tokenIds: chonkIds
        }
      });

      if (functionError) {
        throw new Error(`Supabase function error: ${functionError.message}`);
      }

      if (!data.success) {
        throw new Error('Failed to fetch Gone Green metadata');
      }

      console.log('Gone Green metadata fetched:', data.data);
      
      // Return the data so it can be used to update the nestedNFTs
      return data.data as GoneGreenNFT[];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error updating Gone Green metadata:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateGoneGreenMetadata,
    loading,
    error
  };
};