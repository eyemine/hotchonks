
import { ChonkNFT } from "@/types/chonk";
import { CHONKS_CONTRACT } from "@/constants/chonks";
import { getNestedNFTs } from "./nestedNFTs";

export const processAPIData = (apiResult: any): ChonkNFT[] => {
  const chonksData: ChonkNFT[] = [];
  
  if (apiResult.success && apiResult.data) {
    apiResult.data.forEach((nftData: any) => {
      const tokenId = parseInt(nftData.tokenId);
      const metadata = nftData.metadata;
      const pricing = nftData.pricing;
      
      // Extract price from OpenSea data or use fallback
      let price = 'Not Listed';
      let sold = false;
      
      if (tokenId === 596) {
        price = 'SOLD';
        sold = true;
      } else if (pricing?.best_listing?.price?.decimal) {
        // Use OpenSea v2 API structure
        price = pricing.best_listing.price.decimal;
      } else if (pricing?.orders && pricing.orders.length > 0) {
        // Fallback to old structure if available
        const lowestPrice = pricing.orders
          .filter((order: any) => order.order_type === 'listing')
          .sort((a: any, b: any) => parseFloat(a.current_price) - parseFloat(b.current_price))[0];
        
        if (lowestPrice) {
          price = (parseFloat(lowestPrice.current_price) / 1e18).toFixed(4);
        }
      }

      const nestedNFTs = getNestedNFTs(tokenId);
      
      chonksData.push({
        id: tokenId.toString(),
        name: `Chonk #${tokenId}`,
        image: metadata?.image?.cachedUrl || metadata?.image?.pngUrl || metadata?.image?.thumbnailUrl || (tokenId === 599 ? '/chonk-599.webp' : `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&seed=${tokenId}`),
        collection: 'Chonks',
        price: price,
        chain: 'Base',
        description: tokenId === 599 ? "I'm Chonks.xyz #599, I've gone green. I got my carbon locked." : 
                   `Chonk #${tokenId} from the Base blockchain collection.`,
        carbonOffset: `${(Math.random() * 3 + 1).toFixed(1)} tons`,
        openSeaUrl: `https://opensea.io/item/base/${CHONKS_CONTRACT}/${tokenId}`,
        zoraUrl: `https://zora.co/collect/base:${CHONKS_CONTRACT}/${tokenId}`,
        sold: sold,
        nestedNFTs: nestedNFTs
      });
    });
  }
  
  return chonksData;
};

export const createFallbackData = (tokenIds: number[]): ChonkNFT[] => {
  return tokenIds.map(tokenId => {
    const nestedNFTs = getNestedNFTs(tokenId);

    return {
      id: tokenId.toString(),
      name: `Chonk #${tokenId}`,
      image: tokenId === 599 ? '/chonk-599.webp' : `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&seed=${tokenId}`,
      collection: 'Chonks',
      price: tokenId === 596 ? 'SOLD' : (Math.random() * 0.1 + 0.001).toFixed(4),
      chain: 'Base' as const,
      description: tokenId === 599 ? "I'm Chonks.xyz #599, I've gone green. I got my carbon locked." : `Chonk #${tokenId} from the Base blockchain collection.`,
      carbonOffset: `${(Math.random() * 3 + 1).toFixed(1)} tons`,
      openSeaUrl: `https://opensea.io/item/base/${CHONKS_CONTRACT}/${tokenId}`,
      zoraUrl: `https://zora.co/collect/base:${CHONKS_CONTRACT}/${tokenId}`,
      sold: tokenId === 596,
      nestedNFTs: nestedNFTs
    };
  });
};
