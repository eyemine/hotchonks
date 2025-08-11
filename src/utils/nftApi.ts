
import { CHONKS_CONTRACT } from "@/constants/chonks";

export const fetchNFTDataFromAPI = async (tokenIds: number[]) => {
  const response = await fetch('https://zxbmbnfpgnkcrjacxegi.supabase.co/functions/v1/alchemy-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getNFTMetadata',
      contractAddress: CHONKS_CONTRACT,
      tokenIds: tokenIds.map(id => id.toString()),
      chain: 'base'
    })
  });
  
  if (!response.ok) {
    throw new Error('API failed');
  }
  
  return await response.json();
};
