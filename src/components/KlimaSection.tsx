import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Leaf } from "lucide-react";

export const KlimaSection = () => {
  return (
    <section id="klima" className="py-20 px-4 bg-gradient-carbon">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-bio-green/20 text-bio-light border-bio-green/40">
            Climate Action
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-bio bg-clip-text text-transparent">KlimaDAO</span> Integration
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Each Green Chonk NFT holds 100 $KLIMA (staking since ~May '25 for October's Fair Launch TGE).
          </p>

          {/* Video */}
          <div className="mb-8 flex justify-center">
            <video 
              controls 
              className="rounded-lg shadow-lg max-w-full h-auto"
              style={{ maxHeight: '400px' }}
            >
              <source src="/chonk-staking.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            On October 15th, Klima marks the beginning of a new chapter. Fair Launch concludes with the deployment of two new tokens, $kVCM and $K2
            <br /><br />
            Green Chonk holders can claim their $kVCM, (*at a rate of 1.33:1 staked $Klima) while their $K2 will remain vested for a period TBD
            <br /><br />
            Klima 2.0, creates an open, transparent infrastructure layer for environmental real-world assets. Klima aims to grow a rational, liquid, and trusted market for carbon.
            <br /><br />
            At the core of Klima 2.0 is the Autonomous Asset Manager (AAM) that acquires, prices, and curates carbon credits. These credits are then made available for retirement; the true measure of climate impact within the market.
            <br /><br />
            Klima 2.0 is built on a simple principle: carbon markets should reward the people and projects that create climate impact and participate in the curation of the market.
            <br /><br />
            Each Chonk also virtue signals their green credentials with carbon offset certificates via carbonmark.com. With an average of 7.75 tonnes CO₂ retired per NFT. Here is the green impact of this collection:
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/50 border-bio-green/20 hover:border-bio-green/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bio-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-bio-light" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">155</h3>
              <p className="text-muted-foreground">Tonnes CO₂ Offset</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-bio-green/20 hover:border-bio-green/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bio-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-bio-light" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">1,999</h3>
              <p className="text-muted-foreground">KLIMA Tokens Staked</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-bio-green/20 hover:border-bio-green/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bio-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-bio-light" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">15,500</h3>
              <p className="text-muted-foreground">
                <a 
                  href="https://onetreeplanted.org/blogs/stories/how-much-co2-does-tree-absorb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-bio-light transition-colors underline"
                >
                  Average Trees Absorb in One Year
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="bio" size="lg" className="gap-2" asChild>
            <a href="https://www.klimadao.finance/" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={20} />
              Explore KlimaDAO
            </a>
          </Button>
          <Button variant="bio" size="lg" className="gap-2" asChild>
            <a href="https://www.klimaprotocol.com/" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={20} />
              Explore Fair Launch TGE
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};