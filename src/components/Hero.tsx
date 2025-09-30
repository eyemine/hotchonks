
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, TreePine } from "lucide-react";
import heroForest from "@/assets/hero-forest.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroForest})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" />
      
      {/* Animated Bio Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-bio-glow rounded-full animate-bio-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-bio-light rounded-full animate-bio-pulse opacity-40" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-bio-green rounded-full animate-bio-pulse opacity-80" 
             style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <img 
            src="/ghostagent-profile.png" 
            alt="GhostAgent" 
            className="w-16 h-16 rounded-full border-4 border-bio-green/40"
          />
          <span className="text-white font-bold text-2xl">GhostAgent's</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-bio bg-clip-text text-transparent">
            Green Chonks: CarbonLocks
          </span>
          <br />
          <span className="text-foreground">Join the Green Chonks Crew (20 in total) each Web3 identity bundled by GhostAgent is loaded with value. see:Backpack wallet</span>
        </h1>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-bio-light" size={24} />
      </div>
    </section>
  );
};
