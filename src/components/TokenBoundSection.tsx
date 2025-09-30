import { Button } from "@/components/ui/button";
import tokenBoundImage from "@/assets/token-bound-account.png";

export const TokenBoundSection = () => {
  return (
    <section id="tba" className="py-20 bg-carbon-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-bio bg-clip-text text-transparent">
            Token Bound Account
          </h2>
          
          <div className="mb-12 flex justify-center">
            <img 
              src={tokenBoundImage} 
              alt="Token Bound Account Diagram" 
              className="w-3/4 rounded-lg shadow-lg"
            />
          </div>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed text-center">
              The ERC-6551 standard brings your NFTs to life with token bound accounts. It enables you to use your NFTs like a wallet. • Own other assets • Take action onchain with your NFT • Connect across EVMs • Use your NFT as an identity. By utilising tokenbound.org and WalletConnect The EOA wallet holding the NFT performs
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="bio" 
              size="lg"
              asChild
            >
              <a href="https://tokenbound.org" target="_blank" rel="noopener noreferrer">
                Explore Tokenbound
              </a>
            </Button>
            <Button 
              variant="glow" 
              size="lg"
              asChild
            >
              <a href="https://walletconnect.network/" target="_blank" rel="noopener noreferrer">
                Explore WalletConnect
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
