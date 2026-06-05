
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
      } else if (typeof pricing?.best_listing?.price?.decimal === 'number') {
        // OpenSea v2 Orders parsed by our edge function
        price = (pricing.best_listing.price.decimal as number).toFixed(4);
      } else if (typeof pricing?.best_listing?.price?.decimal === 'string') {
        const dec = parseFloat(pricing.best_listing.price.decimal as string);
        if (!isNaN(dec)) price = dec.toFixed(4);
      } else if (pricing?.orders && pricing.orders.length > 0) {
        // Fallback to older OS shapes if available
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
        image: metadata?.image?.cachedUrl || metadata?.image?.pngUrl || metadata?.image?.thumbnailUrl || `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&seed=${tokenId}`,
        collection: 'Chonks',
        price: price,
        chain: 'Base',
        description: tokenId === 599 ? "I'm Chonks.xyz #599, I've gone green. I got my carbon locked." : 
                   `Chonk #${tokenId} from the Base blockchain collection.`,
        carbonOffset: `${(Math.random() * 3 + 1).toFixed(1)} tons`,
        openSeaUrl: `https://opensea.io/item/base/${CHONKS_CONTRACT}/${tokenId}`,
        zoraUrl: `https://zora.co/collect/base:${CHONKS_CONTRACT}/${tokenId}`,
        sold: sold,
        nestedNFTs: nestedNFTs,
        ...(tokenId === 585 ? { primaryCoinContract: '0xa056f3488947f2e625a1d800f24c531787cd7062' } : {}),
        ...(tokenId === 663 ? { primaryCoinContract: '0xf44591c8044471dd293e8a538189b6596f2795ef' } : {}),
        ...(tokenId === 665 ? { primaryCoinContract: '0x44a86e54e3e49e2fca3c64e4f1fc78199349324c' } : {}),
        ...(tokenId === 672 ? { primaryCoinContract: '0x84fbbecd652c9f8e35cf2be29d5a5c93d1582e89' } : {}),
        ...(tokenId === 676 ? { primaryCoinContract: '0x89735823f88b141a5f50646ccd1517c92b6d45ce' } : {}),
        ...(tokenId === 678 ? { primaryCoinContract: '0xd9dd283d2e3646e6c2795a24932a14adbd1cd788' } : {}),
        ...(tokenId === 680 ? { primaryCoinContract: '0x25046b4f5a5a15682a01d5324c3c77340d5b8ad1' } : {}),
        ...(tokenId === 681 ? { primaryCoinContract: '0xcd6f89037377a917615f13f166677b406ded550b' } : {}),
        ...(tokenId === 693 ? { primaryCoinContract: '0x7fd8b61eada4eb171cf08c3ed12e29bf32727c8d' } : {}),
        ...(tokenId === 700 ? { primaryCoinContract: '0xd975a37a3710f2edf70f514af9709e62d9b61ee5' } : {})
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
