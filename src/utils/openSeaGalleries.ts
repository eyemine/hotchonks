// OpenSea gallery URLs for each Chonk
export const OPENSEA_GALLERIES: Record<number, string> = {
  585: 'https://opensea.io/Green-Chonk585/galleries',
  586: 'https://opensea.io/Green-Chonk586/galleries',
  588: 'https://opensea.io/Green-Chonk588/galleries',
  596: 'https://opensea.io/Green-Chonk596/galleries',
  599: 'https://opensea.io/Green-Chonk599/galleries',
  601: 'https://opensea.io/Green-Chonk601/galleries',
  606: 'https://opensea.io/Green-Chonk606/galleries',
  662: 'https://opensea.io/Green-Chonk662/galleries',
  663: 'https://opensea.io/Green-Chonk663/galleries',
  665: 'https://opensea.io/Green-Chonk665/galleries',
  672: 'https://opensea.io/Green-Chonk672/galleries',
  676: 'https://opensea.io/Green-Chonk676/galleries',
  678: 'https://opensea.io/Green-Chonk678/galleries',
  680: 'https://opensea.io/Green-Chonk680/galleries',
  681: 'https://opensea.io/Green-Chonk681/galleries',
  693: 'https://opensea.io/Green-Chonk693/galleries',
  697: 'https://opensea.io/Green-Chonk697/galleries',
  700: 'https://opensea.io/Green-Chonk700/galleries',
  972: 'https://opensea.io/Green-Chonk972/galleries',
  9534: 'https://opensea.io/Green-Chonk9534/galleries'
};

// Mock gallery NFTs data (in production, this would be fetched from OpenSea API)
export const getGalleryNFTs = (tokenId: number): any[] => {
  const galleryNFTsMap: Record<number, any[]> = {
    585: [
      {
        id: 'gallery-nft-585-1',
        name: 'Eco Warrior #42',
        image: '/lovable-uploads/1c55caa2-5b4a-41a1-ba5b-00a23b5aba74.png',
        collection: 'Eco Warriors',
        openSeaUrl: 'https://opensea.io/assets/ethereum/0x123.../42'
      },
      {
        id: 'gallery-nft-585-2',
        name: 'Carbon Credit #15',
        image: '/lovable-uploads/203aff55-05a6-4206-8547-21930e7f11bd.png',
        collection: 'Carbon Credits',
        openSeaUrl: 'https://opensea.io/assets/ethereum/0x456.../15'
      }
    ],
    586: [
      {
        id: 'gallery-nft-586-1',
        name: 'Green Energy #23',
        image: '/lovable-uploads/20ece027-3f7c-4bfe-ab23-ebf6872160b9.png',
        collection: 'Green Energy',
        openSeaUrl: 'https://opensea.io/assets/ethereum/0x789.../23'
      }
    ],
    588: [
      {
        id: 'gallery-nft-588-1',
        name: 'Sustainable Art #8',
        image: '/lovable-uploads/23d17a8a-8db3-4535-a04d-3842da1b8407.png',
        collection: 'Sustainable Art',
        openSeaUrl: 'https://opensea.io/assets/ethereum/0xabc.../8'
      }
    ],
    // Add more as needed - for now using sample data
  };

  return galleryNFTsMap[tokenId] || [];
};

export const getGalleryUrl = (tokenId: number): string => {
  return OPENSEA_GALLERIES[tokenId] || '';
};