export const Footer = () => {
  return (
    <footer className="py-6 px-4 bg-card/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[#acacac]">
          <span>A <a
            href="https://ghostagent.ninja"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ffca92] transition-colors underline"
          >GhostAgent Ninja</a> Project 2026</span>
          <img
            src="/ghostagent-profile.png"
            alt="GhostAgent Ninja"
            className="w-6 h-6 rounded-full object-cover"
          />
          <a
            href="https://x.com/ghostagent_og"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#ffca92] transition-colors underline"
          >
            @GhostAgent_OG
          </a>
        </div>
      </div>
    </footer>
  );
};
