import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import tokenBoundImage from "@/assets/token-bound-account.png";

const TokenBoundAccount = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-bio bg-clip-text text-transparent">
              Token Bound Account
            </h1>
            
            <div className="mb-12">
              <img 
                src={tokenBoundImage} 
                alt="Token Bound Account Diagram" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
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
      </main>
      <Footer />
    </div>
  );
};

export default TokenBoundAccount;
