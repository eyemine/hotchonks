import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tokenBoundImage from "@/assets/token-bound-account-new.png";

export const TokenBoundSection = () => {
  return (
    <section id="tba" className="py-20 bg-carbon-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-bio-green/20 text-bio-light border-bio-green/40">
              ERC-6551
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-bio bg-clip-text text-transparent">
              Token Bound Account
            </h2>
          </div>
          
          <div className="mb-12 flex justify-center">
            <img 
              src={tokenBoundImage} 
              alt="Token Bound Account Diagram" 
              className="w-3/4 rounded-lg shadow-lg"
            />
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-center">
            The ERC-6551 standard brings your NFTs to life with Token Bound Accounts. It enables you to use your NFTs like a wallet. • Own other assets • Take action onchain with your NFT • Connect across EVMs • Use your NFT as an identity. 
            Once activated by deploying the NFT wallet (also referred to as a 'backpack') through tokenbound.org, select WalletConnect and copy the link generated to tokenbound.org to sign for your NFT's TBA with the EOA wallet holding the NFT. This empowers the NFT to connect and transact across the EVM! 
            Chonks ERC-6551 wallets are already deployed on Base.
          </p>
          
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
              variant="bio" 
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
