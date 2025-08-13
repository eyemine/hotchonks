import { supabase } from "@/integrations/supabase/client";

const BASE_NAMES_CONTRACT = "0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a";

export const fetchBaseNames = async () => {
  const { data, error } = await supabase.functions.invoke('alchemy-api', {
    body: {
      action: 'getContractNFTs',
      contractAddress: BASE_NAMES_CONTRACT,
      chain: 'base'
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch Base Names');
  }

  return data;
};

// Map Base domain names to Chonks based on the number in their title
export const mapBaseNamesToChonks = (baseNames: any[]) => {
  const mapping: Record<string, any> = {};
  
  baseNames.forEach((nft) => {
    const title = nft.title || '';
    
    // Extract chonk number from titles like "chonk585.base.eth", "chonk588.base.eth", etc.
    const chonkMatch = title.match(/chonk(\d+)\.base\.eth/i);
    if (chonkMatch) {
      const chonkId = chonkMatch[1];
      mapping[chonkId] = {
        id: `chonk${chonkId}-base-eth`,
        name: `chonk${chonkId}.base.eth`,
        image: nft.image,
        collection: 'Base Names',
        openSeaUrl: nft.openSeaUrl,
        tokenId: nft.tokenId
      };
    }
  });
  
  return mapping;
};