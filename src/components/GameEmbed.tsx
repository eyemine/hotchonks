import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Maximize2, ExternalLink, Gamepad2 } from "lucide-react";

export const GameEmbed = () => {
  const [isGameLoaded, setIsGameLoaded] = useState(true); // Auto-load game

  return (
    <section id="game" className="py-20 px-4 bg-gradient-carbon">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="text-bio-green" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Interactive</span>{" "}
            <span className="bg-gradient-bio bg-clip-text text-transparent">Chonks Playground</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the interactive Chonks Playground, a custom game created by Marka.eth at Chonks.xyz. 
            Green Chonks holders may receive special game traits and exclusive features in future updates - 
            so keep your Chonks close for upcoming surprises!
          </p>
        </div>

        <Card className="bg-card border-bio-green/20 overflow-hidden shadow-bio">
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-carbon-medium border-b border-bio-green/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-bio-green animate-bio-pulse"></div>
                <span className="text-sm font-medium text-bio-light">Chonks Playground Active</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://playground.chonks.xyz/" target="_blank" rel="noopener noreferrer">
                    <Maximize2 size={14} />
                    Fullscreen
                  </a>
                </Button>
              </div>
            </div>
            <iframe
              src="https://playground.chonks.xyz/"
              className="w-full h-96 md:h-[600px]"
              title="Chonks Playground"
              allow="gamepad; microphone; camera"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </Card>
      </div>
    </section>
  );
};
