
import { CHONKS_CONTRACT } from "@/constants/chonks";
import { supabase } from "@/integrations/supabase/client";

export const fetchNFTDataFromAPI = async (tokenIds: number[]) => {
  const { data, error } = await supabase.functions.invoke('alchemy-api', {
    body: {
      action: 'getNFTMetadata',
      contractAddress: CHONKS_CONTRACT,
      tokenIds: tokenIds.map(id => id.toString()),
      chain: 'base'
    }
  });

  if (error) {
    throw new Error(error.message || 'API failed');
  }

  return data;
};
