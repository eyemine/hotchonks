import { supabase } from "@/integrations/supabase/client";

const KLIMA_CONTRACT = "0x2530ffff980ae3400b0e4c1dc222f1536972077e";

export const fetchKlimaNFTs = async () => {
  const { data, error } = await supabase.functions.invoke('alchemy-api', {
    body: {
      action: 'getContractNFTs',
      contractAddress: KLIMA_CONTRACT,
      chain: 'base'
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch Klima NFTs');
  }

  return data;
};

// Map Klima NFT token IDs to Chonk IDs based on the titles or metadata
export const mapKlimaNFTsToChonks = (klimaNFTs: any[]) => {
  const mapping: Record<string, any[]> = {};
  
  // Look through the NFTs and try to match them to Chonks based on patterns in titles
  klimaNFTs.forEach((nft) => {
    const title = nft.title || '';
    const tokenId = nft.tokenId;
    
    // Since we don't know the exact mapping yet, let's examine the titles
    // The user can tell us which Chonk these should be nested under
    console.log('Klima NFT found:', { tokenId, title, image: nft.image });
    
    // For now, let's check if the title contains any Chonk references
    // This might need to be updated based on the actual data structure
    const chonkMatch = title.match(/chonk(\d+)/i) || title.match(/#(\d+)/);
    if (chonkMatch) {
      const chonkId = chonkMatch[1];
      if (!mapping[chonkId]) {
        mapping[chonkId] = [];
      }
      mapping[chonkId].push({
        id: `klima-${tokenId}`,
        name: title,
        image: nft.image,
        collection: 'Klima DAO',
        openSeaUrl: nft.openSeaUrl,
        tokenId: tokenId
      });
    }
  });
  
  return mapping;
};