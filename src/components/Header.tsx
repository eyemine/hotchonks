

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ color: "#960840" }}>
            HOT CHONKS
          </h1>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/artists" className="text-[#b0805c] hover:text-[#ffca92] transition-colors font-semibold">
              Virtual Artists
            </Link>
            <a href="/#game" className="text-[#b0805c] hover:text-[#ffca92] transition-colors">
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

