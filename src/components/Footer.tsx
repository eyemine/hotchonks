
import { Ghost } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-card/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center flex flex-col items-center gap-2">
          <p className="text-[#acacac] flex items-center gap-2">
            A GhostAgent Ninja Project 2026
            <Ghost className="w-4 h-4 text-[#acacac]" />
          </p>
          <a
            href="https://x.com/ghostagent_og"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#ffca92] transition-colors underline"
          >
            Ghost Agent
          </a>
        </div>
      </div>
    </footer>
  );
};

