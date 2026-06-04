import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Clock, Unlock, ExternalLink, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SidecarDrawer } from "@/components/SidecarDrawer";
import { useChonksData } from "@/hooks/useChonksData";
import { ARTISTS, type Artist } from "@/data/artists";
import ghostMaskIcon from "@/assets/GhostMaskGlowT.png.asset.json";

const CHONKS_CONTRACT = "0xb1ab48c7e074086a91c1f0b12d35a2e2b22cd71b";

const useChonkImage = (tokenId: string): string | undefined => {
  const { chonks } = useChonksData();
  return chonks.find((c) => c.name.includes(`#${tokenId}`))?.image;
};

const ChonkInset = ({
  src,
  tokenId,
  size = "md",
}: {
  src: string;
  tokenId: string;
  size?: "sm" | "md";
}) => {
  const [open, setOpen] = useState(false);
  const pos = size === "md" ? "bottom-4 right-4" : "bottom-3 right-3";
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`absolute ${pos} w-[30%] aspect-square rounded-md overflow-hidden border-2 border-bio-light bg-black opacity-50 hover:opacity-100 shadow-[0_0_16px_hsl(var(--bio-light)/0.35)] hover:shadow-[0_0_24px_hsl(var(--bio-light)/0.9)] transition-all duration-200 cursor-pointer`}
        aria-label={`Open Chonk #${tokenId} HUD`}
      >
        <img
          src={src}
          alt={`Chonk #${tokenId}`}
          className="w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
        />
      </button>

      {open && (
        <div
          className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm p-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-bio-light">
                Sovereign IP Agent • Governing NFT
              </p>
              <p className="text-lg font-black text-foreground">CHONK #{tokenId}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-bio-light hover:text-foreground"
              aria-label="Close HUD"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 grid place-items-center my-3">
            <img
              src={src}
              alt={`Chonk #${tokenId}`}
              className="max-h-full max-w-[60%] rounded-md border border-bio-light/60 shadow-[0_0_30px_hsl(var(--bio-light)/0.6)]"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://opensea.io/item/base/${CHONKS_CONTRACT}/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 border border-blue-500 px-3 py-1.5 text-[10px] font-sans text-white hover:bg-blue-700"
            >
              OPENSEA – Buy NFT, own Agent + IP <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

const StatusPill = ({ status }: { status: Artist["status"] }) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9b0840]/15 border border-[#9b0840]/40 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#9b0840]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9b0840] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#9b0840]" />
        </span>
        <Unlock className="h-3 w-3" /> Story Protocol Active
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-yellow-500">
        <Clock className="h-3 w-3" /> Agent Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
      <Lock className="h-3 w-3" /> Unregistered
    </span>
  );
};

const HeroCard = ({ artist }: { artist: Artist }) => {
  const chonkImg = useChonkImage(artist.tokenId);
  const mainImg = artist.artistImage ?? chonkImg;
  const insetImg = artist.artistImage ? chonkImg : undefined;
  const [sidecarOpen, setSidecarOpen] = useState(false);

  return (
    <div className="md:col-span-3 group relative overflow-hidden rounded-xl border border-violet-500/40 bg-gradient-to-br from-carbon-dark via-carbon-medium to-black shadow-[0_0_60px_rgba(139,92,246,0.25)] transition-all hover:shadow-[0_0_80px_rgba(139,92,246,0.45)]">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Square image area — same format as roster cards */}
        <div className="relative aspect-square overflow-hidden bg-black">
          {mainImg ? (
            <img
              src={mainImg}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              style={artist.artistImage ? undefined : { imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full bg-carbon-medium animate-pulse" />
          )}
          {insetImg && (
            <ChonkInset src={insetImg} tokenId={artist.tokenId} size="md" />
          )}
          <div className="absolute top-4 right-4">
            <StatusPill status={artist.status} />
          </div>
        </div>

        <div className="relative p-8 md:p-10 flex flex-col justify-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{ color: "#efede3" }}>
            Sovereign IP Agent
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-none">
            {artist.name}
          </h2>
          <p className="text-2xl font-mono text-[#9b0840] mt-2">
            CHONK #{artist.tokenId}
          </p>
          <p className="text-sm md:text-base text-muted-foreground font-mono mt-2 mb-6">
            {artist.genre}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#9b0840] text-white hover:bg-[#9b0840]/90 font-bold uppercase tracking-widest shadow-[0_0_24px_hsla(344,89%,31%,0.4)]">
              <Link to={`/studio/${artist.slug}`}>
                Enter Studio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-black border-white/50 text-white hover:bg-black/80 font-sans normal-case">
              <a href={artist.purebpmUrl} target="_blank" rel="noopener noreferrer">
                PureBPM Artist Profile <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
            <Button
              size="lg"
              onClick={() => setSidecarOpen(true)}
              className="font-mono border border-[#b0805c]"
              style={{ backgroundColor: "#271208", color: "#efede3" }}
            >
              <img src={ghostMaskIcon.url} alt="GhostAgent" className="mr-2 h-10 w-10 object-contain" />
              GHOSTAGENT IP PROFILE
            </Button>
          </div>
        </div>
      </div>
      <SidecarDrawer
        open={sidecarOpen}
        onOpenChange={setSidecarOpen}
        tokenId={artist.tokenId}
        name={`Chonk #${artist.tokenId}`}
        chain="Base"
      />
    </div>
  );
};

const RosterCard = ({ artist }: { artist: Artist }) => {
  const chonkImg = useChonkImage(artist.tokenId);
  const isActive = artist.status === "active";
  const mainImg = artist.artistImage ?? chonkImg;
  const insetImg = artist.artistImage ? chonkImg : undefined;
  const [sidecarOpen, setSidecarOpen] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-bio-green/30">
      <div className="relative aspect-square overflow-hidden bg-black">
        {mainImg ? (
          <img
            src={mainImg}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            style={artist.artistImage ? undefined : { imageRendering: "pixelated" }}
          />
        ) : (
          <div className="w-full h-full bg-carbon-medium animate-pulse" />
        )}
        {insetImg && (
          <ChonkInset src={insetImg} tokenId={artist.tokenId} size="sm" />
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{artist.name}</h3>
            <p className="text-xs text-muted-foreground font-mono truncate">
              CHONK #{artist.tokenId} · {artist.genre}
            </p>
          </div>
        </div>

        {isActive ? (
          <StatusPill status={artist.status} />
        ) : (
          <a
            href={artist.purebpmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-black border border-white/50 px-4 py-1.5 text-xs font-sans text-white hover:bg-black/80 transition-colors"
          >
            PureBPM Artist Profile <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="flex gap-2 pt-1">
          {isActive ? (
            <Button asChild size="sm" className="flex-1 bg-bio-green text-primary-foreground hover:bg-bio-light">
              <Link to={`/studio/${artist.slug}`}>Enter Studio</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setSidecarOpen(true)}
              className="flex-1 font-mono border border-[#b0805c]"
              style={{ backgroundColor: "#271208", color: "#efede3" }}
            >
              <img src={ghostMaskIcon.url} alt="GhostAgent" className="mr-2 h-8 w-8 object-contain" />
              GHOSTAGENT IP PROFILE
            </Button>
          )}
        </div>
      </div>
      <SidecarDrawer
        open={sidecarOpen}
        onOpenChange={setSidecarOpen}
        tokenId={artist.tokenId}
        name={`Chonk #${artist.tokenId}`}
        chain="Base"
      />
    </div>
  );
};

const Artists = () => {
  const featured = ARTISTS.filter((a) => a.featured);
  const rest = ARTISTS.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#ffca92] mb-3">
              ghostagent.ninja
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-1">
              Virtual Artists
            </h1>
            <p className="text-xl md:text-2xl font-mono uppercase tracking-[0.3em] mb-3" style={{ color: "#ffca92" }}>
              Sovereign IP Agents
            </p>
            <p className="text-lg text-muted-foreground">
              Own the artist identity. Unlock the catalogue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((a) => (
              <HeroCard key={a.slug} artist={a} />
            ))}
            {rest.map((a) => (
              <RosterCard key={a.slug} artist={a} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
