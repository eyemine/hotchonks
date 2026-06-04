import { Link } from "react-router-dom";
import { ArrowRight, Lock, Clock, Unlock, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useChonksData } from "@/hooks/useChonksData";
import { ARTISTS, type Artist } from "@/data/artists";

const useChonkImage = (tokenId: string): string | undefined => {
  const { chonks } = useChonksData();
  return chonks.find((c) => c.name.includes(`#${tokenId}`))?.image;
};

const StatusPill = ({ status }: { status: Artist["status"] }) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-bio-green/15 border border-bio-green/40 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-bio-light">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bio-light opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bio-light" />
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

  return (
    <div className="md:col-span-3 group relative overflow-hidden rounded-xl border border-bio-green/40 bg-gradient-to-br from-carbon-dark via-carbon-medium to-black shadow-[0_0_60px_hsl(var(--bio-green)/0.15)] transition-all hover:shadow-[0_0_80px_hsl(var(--bio-green)/0.3)]">
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
            <div className="absolute bottom-4 right-4 w-[30%] aspect-square rounded-md overflow-hidden border-2 border-bio-light shadow-[0_0_16px_hsl(var(--bio-light)/0.7)] bg-black">
              <img
                src={insetImg}
                alt={`Chonk #${artist.tokenId}`}
                className="w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <StatusPill status={artist.status} />
          </div>
        </div>

        <div className="relative p-8 md:p-10 flex flex-col justify-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-bio-light mb-2">
            Sovereign IP Agent
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-none">
            {artist.name}
          </h2>
          <p className="text-sm font-mono text-bio-light mt-2">
            CHONK #{artist.tokenId}
          </p>
          <p className="text-sm md:text-base text-muted-foreground font-mono mt-2 mb-6">
            {artist.genre}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-bio-green text-primary-foreground hover:bg-bio-light font-bold uppercase tracking-widest shadow-[0_0_24px_hsl(var(--bio-green)/0.4)]">
              <Link to={`/studio/${artist.slug}`}>
                Enter Studio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-bio-green/40 text-bio-light hover:bg-bio-green/10">
              <a href={artist.purebpmUrl} target="_blank" rel="noopener noreferrer">
                PureBPM Artist Profile <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-bio-green/40 text-bio-light hover:bg-bio-green/10">
              <a href={artist.agentUrl} target="_blank" rel="noopener noreferrer">
                GhostAgent <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RosterCard = ({ artist }: { artist: Artist }) => {
  const chonkImg = useChonkImage(artist.tokenId);
  const isActive = artist.status === "active";
  const mainImg = artist.artistImage ?? chonkImg;
  const insetImg = artist.artistImage ? chonkImg : undefined;

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
          <div className="absolute bottom-3 right-3 w-[30%] aspect-square rounded-md overflow-hidden border-2 border-bio-light shadow-[0_0_16px_hsl(var(--bio-light)/0.7)] bg-black">
            <img
              src={insetImg}
              alt={`Chonk #${artist.tokenId}`}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
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
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-bio-green/10 border border-bio-green/30 px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-bio-light hover:bg-bio-green/20 transition-colors"
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
            <Button asChild size="sm" variant="outline" className="flex-1 border-bio-green/40 text-bio-light hover:bg-bio-green/10">
              <a href={artist.agentUrl} target="_blank" rel="noopener noreferrer">
                GhostAgent Profile <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
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
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-bio-light mb-3">
              ghostagent.ninja
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-1">
              Sovereign IP Agents
            </h1>
            <p className="text-xl md:text-2xl font-mono uppercase tracking-[0.3em] text-bio-light mb-3">
              Virtual Artists
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
