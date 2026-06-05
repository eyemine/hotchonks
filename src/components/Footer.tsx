
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-card/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[#acacac]">
            a{" "}
            <a
              href="https://ghostagent.ninja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#acacac] hover:text-[#ffca92] transition-colors underline"
            >
              GhostAgent Ninja
            </a>
            {" "}project
          </p>
        </div>
      </div>
    </footer>
  );
};
