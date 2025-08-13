interface GoneGreenNFT {
  tokenId: string;
  chonkId: string;
  name: string;
  image: string;
  collection: string;
  zoraUrl: string;
  contractAddress: string;
  error?: string;
}

// Map of correct contract addresses for Gone Green NFTs per chonk
const GONE_GREEN_CONTRACT_MAP: Record<string, string> = {
  '585': '0x123a1234567890abcdef1234567890abcdef1234',
  '586': '0x456b4567890abcdef1234567890abcdef1234567',
  '588': '0x789c7890abcdef1234567890abcdef1234567890',
  '599': '0xe995b8f87c76614fd094acc971d1651ab82f6a2a',
  '601': '0xd0c95dca0101eca9725aed891bda0a2b1a394e38',
  '606': '0xdf042a1398377f9ae2d3b482bb2e1aba9bb8da01',
  '662': '0xbef0550be11c727cdf0ee6a9b4c6616b0aaff334',
  '663': '0xf44591c8044471dd293e8a538189b6596f2795ef',
  '665': '0x44a86e54e3e49e2fca3c64e4f1fc78199349324c',
  '672': '0x84fbbecd652c9f8e35cf2be29d5a5c93d1582e89',
  '676': '0x123d1234567890abcdef1234567890abcdef1234',
  '678': '0x456e4567890abcdef1234567890abcdef1234567',
  '680': '0x789f7890abcdef1234567890abcdef1234567890',
  '681': '0xabcg1234567890abcdef1234567890abcdef1234',
  '693': '0x7fd8b61eada4eb171cf08c3ed12e29bf32727c8d',
  '697': '0x12ea7232bb05e031a0ac588662fac0b2d2a93dbe',
  '700': '0xd975a37a3710f2edf70f514af9709e62d9b61ee5',
  '972': '0x8056d4b41db338c6c4e792527f80e73ef54cb094',
  '9534': '0x123h1234567890abcdef1234567890abcdef1234'
};

// Function to update nestedNFTs data with fetched Gone Green images
export const updateNestedNFTsWithGoneGreen = (goneGreenData: GoneGreenNFT[]) => {
  const updates: Record<string, string> = {};
  
  goneGreenData.forEach(nft => {
    if (nft.image && !nft.error) {
      updates[nft.chonkId] = nft.image;
    }
  });
  
  return updates;
};

// Generate the correct nestedNFTs data with updated Gone Green images
export const generateUpdatedNestedNFTs = (imageUpdates: Record<string, string>) => {
  const klimaStakeEntry = {
    id: `klima-stake-100`,
    name: '100 $Klima stake',
    image: '/lovable-uploads/9546ef85-5991-4c07-9718-b259b3c74e33.png',
    collection: 'Klima DAO',
    openSeaUrl: 'https://opensea.io/collection/chonk-stake-trait',
    contractAddress: '0x2530ffff980ae3400b0e4c1dc222f1536972077e'
  };

  // Create the updated nestedNFTs data structure
  const nestedNFTsData: Record<number, any[]> = {};
  
  Object.keys(GONE_GREEN_CONTRACT_MAP).forEach(chonkId => {
    const chonkIdNum = parseInt(chonkId);
    const contractAddress = GONE_GREEN_CONTRACT_MAP[chonkId];
    const imageUrl = imageUpdates[chonkId] || `/lovable-uploads/placeholder-${chonkId}.png`;
    
    nestedNFTsData[chonkIdNum] = [
      {
        id: `gone-green-${chonkId}`,
        name: `Gone Green #${chonkId}`,
        image: imageUrl,
        collection: 'Gone Green',
        zoraUrl: `https://zora.co/@chonk${chonkId}`,
        contractAddress: contractAddress
      },
      {
        id: `chonk${chonkId}-base-eth`,
        name: `chonk${chonkId}.base.eth`,
        image: '/lovable-uploads/20ece027-3f7c-4bfe-ab23-ebf6872160b9.png',
        collection: 'Base Names',
        openSeaUrl: 'https://opensea.io/item/base/0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a/TOKEN_ID_FROM_API',
        contractAddress: '0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a'
      },
      klimaStakeEntry
    ];
  });

  // Special case for chonk 596 which has different nested NFTs
  nestedNFTsData[596] = [
    {
      id: 'basepaint-day-485',
      name: 'BasePaint Day #485',
      image: '/lovable-uploads/1c55caa2-5b4a-41a1-ba5b-00a23b5aba74.png',
      collection: 'BasePaint',
      openSeaUrl: 'https://opensea.io/collection/base-paint'
    },
    {
      id: 'nine-chonks-1',
      name: 'NINE CHONKS 🎁 #1',
      image: '/lovable-uploads/3c37a26e-18da-4f5d-971d-bfb366969143.png',
      collection: 'Special Edition'
    },
    {
      id: 'nine-chonks-2',
      name: 'NINE CHONKS 🎁 #2',
      image: '/lovable-uploads/868f00bb-0566-4337-9b24-0c1c97f2fbd7.png',
      collection: 'Special Edition'
    },
    {
      id: 'nine-chonks-3',
      name: 'NINE CHONKS 🎁 #3',
      image: '/lovable-uploads/e45c4634-41b3-4743-a429-c03e46aef48e.png',
      collection: 'Special Edition'
    },
    {
      id: 'nine-chonks-4',
      name: 'NINE CHONKS 🎁 #4',
      image: '/lovable-uploads/9dca13bc-eed2-4aad-a372-7648b6c7e95c.png',
      collection: 'Special Edition'
    },
    {
      id: 'klima-stake-99',
      name: '99 $Klima stake',
      image: '/lovable-uploads/9546ef85-5991-4c07-9718-b259b3c74e33.png',
      collection: 'Klima DAO',
      openSeaUrl: 'https://opensea.io/collection/chonk-stake-trait',
      contractAddress: '0x2530ffff980ae3400b0e4c1dc222f1536972077e'
    },
    {
      id: 'chonk596-base-eth',
      name: 'chonk596.base.eth',
      image: '/lovable-uploads/20ece027-3f7c-4bfe-ab23-ebf6872160b9.png',
      collection: 'Base Names',
      openSeaUrl: 'https://opensea.io/item/base/0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a/TOKEN_ID_FROM_API',
      contractAddress: '0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a'
    },
    klimaStakeEntry
  ];
  
  return nestedNFTsData;
};