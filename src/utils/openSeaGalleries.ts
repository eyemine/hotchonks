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
  return [];
};

export const getGalleryUrl = (tokenId: number): string => {
  return OPENSEA_GALLERIES[tokenId] || '';
};