import { fetchKlimaNFTs } from './klimaApi';

// Test function to see what's in the Klima contract
export const testKlimaContract = async () => {
  try {
    console.log('Fetching NFTs from Klima contract...');
    const result = await fetchKlimaNFTs();
    console.log('Klima contract result:', result);
    
    if (result.success && result.data) {
      result.data.forEach((nft: any, index: number) => {
        console.log(`NFT ${index + 1}:`, {
          tokenId: nft.tokenId,
          title: nft.title,
          description: nft.description?.substring(0, 100) + '...',
          image: nft.image
        });
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error testing Klima contract:', error);
    return null;
  }
};