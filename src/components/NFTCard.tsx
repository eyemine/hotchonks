
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useZoraPrices } from "@/hooks/useZoraPrices";
import { extractContractFromZoraUrl } from "@/utils/zoraApi";
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
                <span className="font-medium">Look in backpack {getENSName(nft.name)}! 🎒</span>
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
                                 <p className="text-lg font-bold text-green-500">Staking ends est. Q3 2025</p>
                               ) : null}
                             </div>
                            
                             <div className="flex gap-1">
                               {isKlimaStaked && (
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   asChild
                                   className="p-1 h-6 text-xs text-bio-light hover:text-bio-glow"
                                 >
                                   <a href="https://www.klimaprotocol.com/faq" target="_blank" rel="noopener noreferrer">
                                     <ExternalLink size={10} className="mr-1" />
                                     KlimaProtocol
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
                                     Zora
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
                                      Zora
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
