
export interface ChonkNFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  price: string;
  chain: "Base";
  description: string;
  carbonOffset: string;
  openSeaUrl: string;
  zoraUrl: string;
  sold?: boolean;
  nestedNFTs: {
    id: string;
    name: string;
    image: string;
    collection: string;
    zoraUrl?: string;
  }[];
}
