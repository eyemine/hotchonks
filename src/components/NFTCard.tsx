
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useZoraPrices } from "@/hooks/useZoraPrices";
import { extractContractFromZoraUrl } from "@/utils/zoraApi";

interface NestedNFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  zoraUrl?: string;
  openSeaUrl?: string;
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
}

interface NFTCardProps {
  nft: NFT;
}

export const NFTCard = ({ nft }: NFTCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { prices, marketCaps, loading: pricesLoading } = useZoraPrices(nft.nestedNFTs);

  return (
    <Card className="group bg-card border-border hover:border-bio-green/40 transition-all duration-500 hover:shadow-bio">
      <div className="p-6">
        {/* Main NFT Image - Square and Larger */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img 
            src={nft.image} 
            alt={nft.name}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Semi-transparent overlay for sold items */}
          {nft.sold && (
            <div className="absolute inset-0 bg-black/50" />
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
            <div className="pt-2">
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
                <span className="font-medium">Look in the backpack! 🎒</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-4">{/* Larger nested items */}
                  {nft.nestedNFTs.map((nested) => {
                    const contractAddress = nested.zoraUrl ? extractContractFromZoraUrl(nested.zoraUrl) : null;
                    const price = contractAddress ? prices[contractAddress] : null;
                    const marketCap = contractAddress ? marketCaps[contractAddress] : null;
                    
                    const isGoneGreen = nested.collection === 'Gone Green' || /Gone\s+Green/i.test(nested.name);
                    const numberTag = nested.name.match(/#\d+/)?.[0] || '';
                    
                    return (
                    <div key={nested.id} className="bg-card rounded-lg p-4 border border-border hover:border-bio-green/30 transition-all duration-300 hover:scale-105 cursor-pointer group/nested overflow-hidden">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 overflow-hidden rounded">
                          <img 
                            src={nested.image} 
                            alt={nested.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/nested:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Name formatting */}
                          {isGoneGreen ? (
                            <p className="text-base md:text-lg font-semibold text-foreground leading-tight">
                              <span className="block">Gone</span>
                              <span className="block">Green</span>
                              <span className="block">{numberTag}</span>
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-foreground truncate">{nested.name}</p>
                          )}

                          {/* Market cap or collection */}
                          {nested.zoraUrl ? (
                            <p className="text-sm text-muted-foreground mb-2">
                              {marketCap ? `${marketCap} ETH market cap` : '—'}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mb-2">{nested.collection}</p>
                          )}

                          {price && !pricesLoading && (
                            <p className="text-base md:text-lg font-bold text-bio-green">{price} ETH</p>
                          )}
                          {pricesLoading && nested.zoraUrl && (
                            <p className="text-xs text-muted-foreground">Loading price...</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {nested.zoraUrl && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild
                                className="p-1 h-auto text-xs text-bio-light hover:text-bio-glow"
                              >
                                <a href={nested.zoraUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink size={12} className="mr-1" />
                                  Zora
                                </a>
                              </Button>
                            )}
                            {nested.openSeaUrl && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild
                                className="p-1 h-auto text-xs text-bio-light hover:text-bio-glow"
                              >
                                <a href={nested.openSeaUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink size={12} className="mr-1" />
                                  OpenSea
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
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
              Buy on OpenSea
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
};
