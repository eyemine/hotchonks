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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each Green Chonk NFT holds 100 $KLIMA (staking for September's TGE) and is backed by real carbon offset certificates via carbonmark.com. With an average of 7.75 tonnes CO₂ retired per NFT. Here is the green impact of this collection:
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
              <p className="text-muted-foreground">Tons CO₂ Offset</p>
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
              <h3 className="text-2xl font-bold text-foreground mb-2">5,968</h3>
              <p className="text-muted-foreground">Trees Equivalent</p>
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
              Explore KlimaProtocol
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};