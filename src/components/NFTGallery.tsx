
import { NFTCard } from "./NFTCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useChonksData } from "@/hooks/useChonksData";

export const NFTGallery = () => {
  const { chonks, loading, error } = useChonksData();

  if (loading) {
    return (
      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-bio bg-clip-text text-transparent">Green Chonks: CarbonLocks</span>
              <br />
              <span className="text-foreground">TBA Bundle Shop</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading real Green Chonks data from the blockchain...
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-bio bg-clip-text text-transparent">Green Chonks: CarbonLocks</span>
              <br />
              <span className="text-foreground">TBA Bundle Shop</span>
            </h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium mb-2">Failed to load NFT data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-bio bg-clip-text text-transparent">Green Chonks: CarbonLocks</span>
              <br />
              <span className="text-foreground">TBA Bundle Shop</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the Green Chonks Crew (20 in total). Each Web3 identity has been carefully curated and bundled by{" "}
              <a 
                href="https://x.com/ghostagent_og" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-bio-light hover:text-bio-glow transition-colors"
              >
                GhostAgent
              </a>
              . They're chock full of value! Look in the Chonk's backpack below
            </p>
          </div>

        {/* NFT Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {chonks.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </section>
  );
};
