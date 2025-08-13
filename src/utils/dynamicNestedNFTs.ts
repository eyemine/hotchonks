import { supabase } from '@/integrations/supabase/client';

// Store for fetched Gone Green images
let goneGreenImageCache: Record<string, string> = {};
let isFetching = false;
let hasAttemptedFetch = false;

// Function to fetch and cache Gone Green images
const fetchAndCacheGoneGreenImages = async (): Promise<Record<string, string>> => {
  if (isFetching) {
    // Wait for existing fetch to complete
    while (isFetching) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return goneGreenImageCache;
  }

  if (hasAttemptedFetch) {
    return goneGreenImageCache;
  }

  isFetching = true;
  hasAttemptedFetch = true;

  try {
    console.log('Fetching Gone Green images from Zora...');
    
    const chonkIds = ['585', '586', '588', '599', '601', '606', '662', '663', '665', '672', '676', '678', '680', '681', '693', '697', '700', '972', '9534'];

    const { data, error } = await supabase.functions.invoke('alchemy-api', {
      body: {
        action: 'getGoneGreenMetadata',
        tokenIds: chonkIds
      }
    });

    if (error) {
      console.error('Error fetching Gone Green images:', error);
      return goneGreenImageCache;
    }

    if (!data.success) {
      console.error('Gone Green API call failed:', data);
      return goneGreenImageCache;
    }

    // Cache the fetched images
    data.data.forEach((nft: any) => {
      if (nft.image && !nft.error) {
        goneGreenImageCache[nft.chonkId] = nft.image;
        console.log(`Cached image for Chonk ${nft.chonkId}:`, nft.image);
      }
    });

    console.log('Gone Green images cached:', goneGreenImageCache);
    return goneGreenImageCache;

  } catch (error) {
    console.error('Error in fetchAndCacheGoneGreenImages:', error);
    return goneGreenImageCache;
  } finally {
    isFetching = false;
  }
};

// Get nested NFTs with dynamic Gone Green images
export const getNestedNFTs = (chonkId: number) => {
  // Standard 100 $Klima stake entry for all Chonks
  const klimaStakeEntry = {
    id: `klima-stake-100-${chonkId}`,
    name: '100 $Klima stake',
    image: '/lovable-uploads/9546ef85-5991-4c07-9718-b259b3c74e33.png',
    collection: 'Klima DAO',
    openSeaUrl: 'https://opensea.io/collection/chonk-stake-trait',
    contractAddress: '0x2530ffff980ae3400b0e4c1dc222f1536972077e'
  };

  // Default fallback images for Gone Green (current static images)
  const fallbackImages: Record<string, string> = {
    '585': '/lovable-uploads/23d17a8a-8db3-4535-a04d-3842da1b8407.png',
    '586': '/lovable-uploads/c38e2fdb-061a-4594-9810-26381a574c8e.png',
    '588': '/lovable-uploads/9ba13695-94cb-4da6-9696-e17b0eed8929.png',
    '599': '/lovable-uploads/337b7708-ebcf-4696-ac2e-07e46315a15e.png',
    '601': '/lovable-uploads/4168b385-def6-4539-a53b-4199c24a41cd.png',
    '606': '/lovable-uploads/ef9c1e7c-9349-4eb2-9c43-ef8f43449a55.png',
    '662': '/lovable-uploads/c2e3f237-b22b-4679-a8fb-f78f714d0125.png',
    '663': '/lovable-uploads/ceb85d63-f5aa-436d-93af-7f5e2db6969c.png',
    '665': '/lovable-uploads/f45142a4-0651-4e29-8814-9dca1a418963.png',
    '672': '/lovable-uploads/50e134f7-a136-4942-9b36-e22388de4367.png',
    '676': '/lovable-uploads/42d78e09-011b-4ead-a4fa-bfdff93f482d.png',
    '678': '/lovable-uploads/79a68dd8-bd3a-4565-80d5-12dac0713bfb.png',
    '680': '/lovable-uploads/7a46b1a8-fb49-4e33-89c5-0e6b72b5e94c.png',
    '681': '/lovable-uploads/c7d6c82d-b7a4-4308-8606-2cde3aa9f608.png',
    '693': '/lovable-uploads/6ae587b6-de3a-43e1-ac42-5b76f0076c44.png',
    '697': '/lovable-uploads/aba91b1a-f66a-43ec-a6b1-8edc48137296.png',
    '700': '/lovable-uploads/f03fadfc-4f72-4926-8fa0-2843426fb6da.png',
    '972': '/lovable-uploads/bf594925-cfe3-4c85-aea2-99e87e52bc3f.png',
    '9534': '/lovable-uploads/82ec3bc0-b45c-4690-ae19-f9c61b898daf.png'
  };

  const contractAddresses: Record<string, string> = {
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

  // Use cached image if available, otherwise use fallback
  const getGoneGreenImage = (chonkIdStr: string) => {
    return goneGreenImageCache[chonkIdStr] || fallbackImages[chonkIdStr] || '/lovable-uploads/placeholder.png';
  };

  const chonkIdStr = chonkId.toString();

  // Special case for chonk 596 which has different nested NFTs
  if (chonkId === 596) {
    return [
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
  }

  // For all other chonks with Gone Green NFTs
  if (contractAddresses[chonkIdStr]) {
    return [
      {
        id: `gone-green-${chonkId}`,
        name: `Gone Green #${chonkId}`,
        image: getGoneGreenImage(chonkIdStr), // This will use Zora image if available
        collection: 'Gone Green',
        zoraUrl: `https://zora.co/@chonk${chonkId}`,
        contractAddress: contractAddresses[chonkIdStr]
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
  }

  // Return empty array for chonks without nested NFTs
  return [];
};

// Function to trigger fetching Gone Green images (call this once)
export const initializeGoneGreenImages = async () => {
  if (!hasAttemptedFetch) {
    await fetchAndCacheGoneGreenImages();
  }
};

// Function to force refresh Gone Green images
export const refreshGoneGreenImages = async () => {
  hasAttemptedFetch = false;
  goneGreenImageCache = {};
  return await fetchAndCacheGoneGreenImages();
};