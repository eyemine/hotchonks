
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-card/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-muted-foreground">
            Site made by{" "}
            <a 
              href="https://www.x.com/ghostagent_og" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-bio-light hover:text-bio-glow transition-colors"
            >
              @ghostagent_og
            </a>
            {" "}&{" "}
            <a 
              href="https://www.x.com/bitpixi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              @bitpixi
            </a>
            {" "}| Learn more about{" "}
            <a 
              href="https://eips.ethereum.org/EIPS/eip-6551" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-bio-light hover:text-bio-glow transition-colors underline"
            >
              ERC-6551
            </a>
            {" "}| Scroll up and buy a Chonk 😡
          </p>
        </div>
      </div>
    </footer>
  );
};
