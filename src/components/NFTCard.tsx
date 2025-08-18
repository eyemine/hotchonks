
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useZoraPrices } from "@/hooks/useZoraPrices";
import { extractContractFromZoraUrl } from "@/utils/zoraApi";
import { getGalleryUrl } from "@/utils/openSeaGalleries";
import openSeaLogo from "@/assets/opensea-logo.png";

interface NestedNFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  zoraUrl?: string;
  openSeaUrl?: string;
  contractAddress?: string;
}

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  price: string;
  chain: "Base" | "Zora";
  description: string;
  nestedNFTs: NestedNFT[];
  carbonOffset: string;
  openSeaUrl?: string;
  zoraUrl?: string;
  sold?: boolean;
  primaryCoinContract?: string;
}

interface NFTCardProps {
  nft: NFT;
}


export const NFTCard = ({ nft }: NFTCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getENSName = (nftName: string): string => {
    const match = nftName.match(/Chonk #(\d+)/);
    if (match) {
      const number = match[1];
      return `chonk${number}.base.eth`;
    }
    return "chonk585.base.eth"; // fallback
  };

  const getStakeTxUrl = (nftName: string): string => {
    const match = nftName.match(/Chonk #(\d+)/);
    if (!match) return '';
    
    const chonkId = match[1];
    const stakeTxMap: { [key: string]: string } = {
      '585': 'https://basescan.org/tx/0x38a22abf93f40d36a06d1e7ddf168ff86ce92df48e9c970aa13795851c148a4b',
      '586': 'https://basescan.org/tx/0x1cb802dc82c026f827ffb637998a324f54abf6a97e7f779452db87bb957da703',
      '588': 'https://basescan.org/tx/0x9ea2e59eea0496b81f0802ea50950587035e02b0f28c6a3c64202ccfb08c220d',
      '596': 'https://basescan.org/tx/0xa543ce8347e11e200bab5c67595071bf0d4d0008bfbed94775b86229a8ddd9a6',
      '599': 'https://basescan.org/tx/0x76f0a3ff2c09d9bd465786de30b32cb5538665025634a281ef6b184f5ae53e67',
      '601': 'https://basescan.org/tx/0xc22bbc208ae16f9d5eedbd45fa42ec3f82818a86a685ed9d00a8bcf77bb76e45',
      '606': 'https://basescan.org/tx/0xd889e4c8dd52c33fccddcce34372f25ec46e2c92bb289b200c3d67ee7f743de1',
      '662': 'https://basescan.org/tx/0xed19abb2012a78f7f0870d21f910fea5849c7031c2ae7289093cabee51fca920',
      '663': 'https://basescan.org/tx/0x62d0d4c9e61501c6fbe3b340a0078b29cba9ee1c44285108a366e61dd238907e',
      '665': 'https://basescan.org/tx/0xed3cb7b038421b129155555dfa354e442136199dd4189f27f67b44513be3c232',
      '672': 'https://basescan.org/tx/0x5941a63acbda4521faf7ab93d4358d968b9163e2fa0159c67ebb93e13b0c9f78',
      '676': 'https://basescan.org/tx/0x7eea087b99981394528bb88e398dcfa38e0e7ca315643d2049cce0d0653643d3',
      '678': 'https://basescan.org/tx/0x4c97ac8045606116f723d6de700d1e729cbab07bdc5ebb3a618cbe84efb31a4e',
      '680': 'https://basescan.org/tx/0xb7fe7343e10baa6de0c2fae6e8a5c24b0fbf624dc7fadd2d9617d6eacaefa38a',
      '681': 'https://basescan.org/tx/0xaa3d7664d1080876ce95f1faebb2eda756141d319caf14b6076694473092f6ee',
      '693': 'https://basescan.org/tx/0xbf8b9a503273646bd10948a23df3a96ca3006eaa809379c45e1dda3aaaa71b0e',
      '697': 'https://basescan.org/tx/0xf248f91058ac7f3a1c4ff7aab89404905364fdc2e8e5dda70ccc73ecc656bcc4',
      '700': 'https://basescan.org/tx/0x54d0b9e291ee968e7098613b1d5025f95a2d3582e7df97685ce1fd2511f36ddb',
      '972': 'https://basescan.org/tx/0x07b117e3d9d184bc3020d937ba7607b6cd1ab91dd36ea1f8ddaf861446cad233',
      '9534': 'https://basescan.org/tx/0x81e3b2931334faf0623a41136c0779c7c70f87d42aa8d33566f24a546b095fb2'
    };
    
    return stakeTxMap[chonkId] || '';
  };
  
  const { prices, marketCaps, loading: pricesLoading } = useZoraPrices([
    ...nft.nestedNFTs,
    ...(nft.primaryCoinContract
      ? [{ id: 'primary', name: 'Primary', image: '', collection: 'Zora Coin', contractAddress: nft.primaryCoinContract }]
      : [])
  ]);

  return (
    <Card className="group bg-card border-border hover:border-bio-green/40 transition-all duration-500 hover:shadow-bio">
      <div className="p-6">
        {/* Main NFT Image - Square and Larger */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          {nft.openSeaUrl ? (
            <a href={nft.openSeaUrl} target="_blank" rel="noopener noreferrer" className="block">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              />
            </a>
          ) : (
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {/* Semi-transparent overlay for sold items */}
          {nft.sold && (
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
          )}
          {nft.sold && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-destructive text-destructive-foreground border-0">
                SOLD
              </Badge>
            </div>
          )}
        </div>

        {/* NFT Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{nft.name}</h3>
          </div>

          {/* Price - only show if not sold and not coming soon */}
          {!nft.sold && nft.price !== 'Coming Soon' && nft.price !== 'SOLD' && (
            <div className="pt-2 space-y-1">
              <span className="text-lg font-bold text-foreground">
                {nft.price} ETH
              </span>
            </div>
          )}

          {/* Coming Soon or Sold status */}
          {(nft.sold || nft.price === 'Coming Soon') && (
            <div className="pt-2">
              <span className="text-lg font-bold text-foreground">
                {nft.sold ? (
                  <span className="text-destructive">SOLD</span>
                ) : (
                  <span className="text-muted-foreground">Coming Soon</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nested NFTs Collapsible */}
      {nft.nestedNFTs.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="border-t border-border bg-carbon-medium/30">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full p-4 justify-between text-bio-light hover:text-bio-glow hover:bg-bio-green/10 transition-colors"
              >
                <span className="font-medium">
                  <span className="md:hidden">Backpack of {getENSName(nft.name)}</span>
                  <span className="hidden md:inline">Look in the backpack of {getENSName(nft.name)}</span>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-3">
                  {nft.nestedNFTs.map((nested) => {
                    const contractAddress = nested.contractAddress || (nested.zoraUrl ? extractContractFromZoraUrl(nested.zoraUrl) : null);
                    const price = contractAddress ? prices[contractAddress] : null;
                    const marketCap = contractAddress ? marketCaps[contractAddress] : null;
                    
                    // Debug logging
                    console.log(`Nested item ${nested.name}:`, { contractAddress, price, marketCap, pricesLoading });
                    
                    const isGoneGreen = nested.collection === 'Gone Green' || /Gone\s+Green/i.test(nested.name);
                    const isKlimaStaked = nested.collection === 'Klima Protocol' || nested.name.includes('$KLIMA Staked');
                    const numberTag = nested.name.match(/#\d+/)?.[0] || '';
                    
                    return (
                    <div key={nested.id} className="bg-card rounded-lg p-3 border border-border hover:border-bio-green/30 transition-all duration-300 hover:scale-102 cursor-pointer group/nested">
                      {(isGoneGreen || isKlimaStaked) ? (
                        /* Vertical layout for Gone Green NFTs - larger image with text below */
                        <div className="space-y-3">
                          <div className="w-full aspect-square overflow-hidden rounded">
                            <img 
                              src={nested.image} 
                              alt={nested.name}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover/nested:scale-105"
                            />
                          </div>
                           <div>
                             <div className="mb-2">
                               <p className="text-sm font-semibold text-foreground leading-tight">
                                 {isGoneGreen ? `Gone Green ${numberTag}` : nested.name}
                               </p>
                             </div>
                             
                             {/* Market cap for Gone Green, special styling for KLIMA */}
                             <div className="mb-2">
                               {isGoneGreen && marketCap && !pricesLoading ? (
                                 <p className="text-lg font-bold text-bio-green">${marketCap} market cap</p>
                               ) : isGoneGreen && pricesLoading ? (
                                 <p className="text-sm text-muted-foreground">Loading...</p>
                               ) : isGoneGreen ? (
                                 <p className="text-sm text-muted-foreground">Market cap unavailable</p>
                                ) : isKlimaStaked ? (
                                  <a 
                                    href="https://www.klimaprotocol.com/faq" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-lg font-bold text-bio-green hover:underline"
                                  >
                                    Staking ends ~Q3 '25
                                  </a>
                                ) : null}
                             </div>
                            
                              <div className="flex gap-1">
                                {isKlimaStaked && getStakeTxUrl(nft.name) && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                  >
                                    <a href={getStakeTxUrl(nft.name)} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={10} className="mr-1" />
                                      Stake Tx
                                    </a>
                                  </Button>
                                )}
                               {nested.zoraUrl && (
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   asChild
                                   className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                 >
                                    <a href={nested.zoraUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={10} className="mr-1" />
                                      Backpack Zora Account
                                    </a>
                                 </Button>
                               )}
                               {nested.openSeaUrl && (
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   asChild
                                   className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                 >
                                   <a href={nested.openSeaUrl} target="_blank" rel="noopener noreferrer">
                                     <ExternalLink size={10} className="mr-1" />
                                     OpenSea
                                   </a>
                                 </Button>
                               )}
                             </div>
                          </div>
                        </div>
                      ) : (
                        /* Horizontal layout for non-Gone Green NFTs */
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded">
                            <img 
                              src={nested.image} 
                              alt={nested.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/nested:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate mb-1">{nested.name}</p>

                            {/* Collection for non-Zora items only */}
                            {!nested.zoraUrl && (
                              <p className="text-xs text-muted-foreground mb-1">{nested.collection}</p>
                            )}

                            {/* Price for non-Gone Green items */}
                            <div className="flex items-center justify-between">
                              {price && !pricesLoading ? (
                                <p className="text-sm font-bold text-bio-green">{price} ETH</p>
                              ) : pricesLoading && nested.zoraUrl ? (
                                <p className="text-xs text-muted-foreground">Loading...</p>
                              ) : null}
                              
                              <div className="flex gap-1">
                                {nested.zoraUrl && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                  >
                                     <a href={nested.zoraUrl} target="_blank" rel="noopener noreferrer">
                                       <ExternalLink size={10} className="mr-1" />
                                       Backpack Zora Account
                                     </a>
                                  </Button>
                                )}
                                {nested.openSeaUrl && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                  >
                                    <a href={nested.openSeaUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={10} className="mr-1" />
                                      OpenSea
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
                
                {/* Gallery Link at bottom */}
                {getGalleryUrl(parseInt(nft.id)) && (
                  <div className="mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      asChild
                      className="w-full bg-black text-white hover:bg-gray-800 border-0"
                    >
                      <a href={getGalleryUrl(parseInt(nft.id))} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={12} className="mr-2 text-white" />
                        View Full Gallery on OpenSea
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      {/* OpenSea Button */}
      {nft.openSeaUrl && (
        <div className="p-4 border-t border-border">
          <Button 
            variant="default" 
            size="sm" 
            asChild
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white border-0"
          >
            <a href={nft.openSeaUrl} target="_blank" rel="noopener noreferrer">
              <img src={openSeaLogo} alt="OpenSea" className="w-4 h-4 mr-2" />
              Buy on OpenSea
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
};
