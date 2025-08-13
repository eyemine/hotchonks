import { supabase } from '@/integrations/supabase/client';

// Function to fetch Gone Green metadata and return updated image mappings
export const fetchGoneGreenImages = async () => {
  try {
    console.log('Fetching Gone Green metadata from Zora...');
    
    // Get all the chonk IDs that have Gone Green NFTs
    const chonkIds = ['585', '586', '588', '599', '601', '606', '662', '663', '665', '672', '676', '678', '680', '681', '693', '697', '700', '972', '9534'];

    const { data, error } = await supabase.functions.invoke('alchemy-api', {
      body: {
        action: 'getGoneGreenMetadata',
        tokenIds: chonkIds
      }
    });

    if (error) {
      console.error('Error calling Supabase function:', error);
      return null;
    }

    if (!data.success) {
      console.error('API call failed:', data);
      return null;
    }

    console.log('Gone Green metadata fetched successfully:', data.data);
    
    // Create image mapping from the fetched data
    const imageUpdates: Record<string, string> = {};
    
    data.data.forEach((nft: any) => {
      if (nft.image && !nft.error) {
        imageUpdates[nft.chonkId] = nft.image;
        console.log(`Chonk ${nft.chonkId}: ${nft.image}`);
      }
    });

    return imageUpdates;

  } catch (error) {
    console.error('Error fetching Gone Green images:', error);
    return null;
  }
};

// Call this function to test the API
export const testGoneGreenFetch = async () => {
  const results = await fetchGoneGreenImages();
  if (results) {
    console.log('Image updates ready:', results);
  }
  return results;
};