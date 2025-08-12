

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-bio bg-clip-text text-transparent">
            Green Chonks
          </h1>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#klima" className="text-muted-foreground hover:text-bio-light transition-colors">
              KlimaDAO
            </a>
            <a href="#gallery" className="text-muted-foreground hover:text-bio-light transition-colors">
              Bundle Shop
            </a>
            <a href="#game" className="text-muted-foreground hover:text-bio-light transition-colors">
              Chonks Playground
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

