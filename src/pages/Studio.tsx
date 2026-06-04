import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Radio,
  Database,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AudioTabs } from "@/components/artists/AudioTabs";
import { getArtistBySlug, truncateAddress } from "@/data/artists";
import { useChonksData } from "@/hooks/useChonksData";
import { envioQuery, ENVIO_CONTRACT } from "@/utils/envioApi";

interface MetadataRow {
  key: string;
  value: string;
}

const METADATA_QUERY = /* GraphQL */ `
  query GetSidecarMetadata($tokenIds: [BigInt!]) {
    Metadata(where: { tokenId: { _in: $tokenIds } }) {
      tokenId
      key
      value
    }
  }
`;

const NUMERIC_QUERY = /* GraphQL */ `
  query GetSidecarMetadata($tokenIds: [numeric!]) {
    Metadata(where: { tokenId: { _in: $tokenIds } }) {
      tokenId
      key
      value
    }
  }
`;

function hexToAddress(value?: string | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v.startsWith("0x")) return v;
  const hex = v.slice(2);
  if (hex.length <= 40) return v.toLowerCase();
  return ("0x" + hex.slice(-40)).toLowerCase();
}

const Copyable = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-bio-light transition-colors text-xs font-mono"
    >
      {copied ? <Check className="h-3 w-3 text-bio-light" /> : <Copy className="h-3 w-3" />}
      {text}
    </button>
  );
};

const Studio = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? getArtistBySlug(slug) : undefined;
  const { chonks } = useChonksData();
  const chonkImage = artist
    ? chonks.find((c) => c.name.includes(`#${artist.tokenId}`))?.image
    : undefined;

  const [rows, setRows] = useState<MetadataRow[] | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    if (!artist) return;
    let cancelled = false;
    setMetaLoading(true);
    const fetchMeta = async () => {
      try {
        let data;
        try {
          data = await envioQuery<{ Metadata: MetadataRow[] }>(METADATA_QUERY, {
            tokenIds: [artist.tokenId],
          });
        } catch {
          data = await envioQuery<{ Metadata: MetadataRow[] }>(NUMERIC_QUERY, {
            tokenIds: [artist.tokenId],
          });
        }
        if (!cancelled) setRows(data.Metadata ?? []);
      } catch (e) {
        console.error("Envio metadata fetch failed:", e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    };
    fetchMeta();
    return () => {
      cancelled = true;
    };
  }, [artist]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Artist not found.</p>
          <Button asChild variant="outline">
            <Link to="/artists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roster
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const findValue = (k: string) => rows?.find((r) => r.key === k)?.value;
  const ipIdFromChain = hexToAddress(findValue("story[ip_id]"));
  const vaultId = findValue("cdr[vault_id]");
  const ipId = artist.storyIpId || ipIdFromChain;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative pt-20">
        {/* Top zone — full-bleed hero portrait at 15% opacity with red glow */}
        {artist.artistImage && (
          <div className="absolute inset-x-0 top-16 h-[520px] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,8,64,0.45),transparent_70%)]" />
            <img
              src={artist.artistImage}
              alt=""
              className="w-full h-full object-cover opacity-[0.25] mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
          </div>
        )}

        <div className="container mx-auto px-4 relative">
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-bio-light transition-colors mb-6"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Roster
          </Link>

          {/* IDENTITY */}
          <section className="mb-10">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {chonkImage && (
                <div className="flex-shrink-0">
                  <div className="rounded-lg overflow-hidden border-2 border-bio-light shadow-[0_0_32px_hsl(var(--bio-light)/0.5)] bg-black p-1">
                    <img
                      src={chonkImage}
                      alt={artist.name}
                      className="w-32 h-32 object-cover rounded"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-bio-light mb-2">
                  Sovereign IP Pod · Chonk #{artist.tokenId}
                </p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-none mb-3">
                  {artist.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                  <a
                    href={artist.purebpmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bio-light hover:underline font-mono inline-flex items-center gap-1"
                  >
                    {artist.handle}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Copyable text={artist.email} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>.agent.gno</Badge>
                  <Badge tone={artist.storyIpId ? "active" : "muted"}>
                    Story Protocol: {artist.storyIpId ? "Registered" : "Unregistered"}
                  </Badge>
                  <Badge tone={artist.cdrActive ? "active" : "muted"}>
                    CDR: {artist.cdrActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Protocol infrastructure accordion */}
                <Collapsible className="mt-4">
                  <CollapsibleTrigger className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-bio-light inline-flex items-center gap-1">
                    Protocol Infrastructure
                    <ChevronDown className="h-3 w-3" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1 text-xs font-mono text-muted-foreground">
                    <div>TBA: {truncateAddress(artist.tba) || "—"}</div>
                    <div>Safe: {truncateAddress(artist.safe) || "—"}</div>
                    <div>Owner: {truncateAddress(artist.owner) || "—"}</div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* MIDDLE — IP STATUS */}
          <section className="mb-8 rounded-lg border border-bio-green/30 bg-carbon-medium/60 p-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-bio-light mb-3">
              Story Protocol IP Asset
            </p>
            {ipId ? (
              <a
                href={`https://aeneid.storyscan.io/address/${ipId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-foreground hover:text-bio-light break-all"
              >
                {ipId.slice(0, 6)}…{ipId.slice(-4)}
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            ) : (
              <span className="text-muted-foreground text-sm">No IP asset registered</span>
            )}

            <div className="mt-4">
              <a
                href={`https://ghostagent.ninja/ip-portal?agent=chonk-${artist.tokenId}&sld=agent`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-bio-light hover:underline inline-flex items-center gap-1"
              >
                Open IP Portal <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>

          {/* BOTTOM — VAULT + ON-CHAIN RAIL */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 pb-12">
            <AudioTabs artist={artist} />

            {/* On-chain intelligence rail */}
            <aside className="rounded-lg border border-border bg-carbon-medium/40 p-4 space-y-4 font-mono">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  On-Chain Intelligence
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Radio className="h-3 w-3 text-bio-light" />
                  <span className="text-bio-light">Envio Indexer · Live</span>
                </div>
              </div>

              <div className="rounded border border-bio-green/30 bg-black/40 p-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                  story[ip_id]
                </p>
                <p className="text-xs text-foreground break-all">
                  {metaLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : ipId ? (
                    <>
                      {ipId.slice(0, 10)}…{ipId.slice(-6)}{" "}
                      <span className="text-bio-light">✅</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </p>
              </div>

              <div className="rounded border border-bio-green/30 bg-black/40 p-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                  cdr[vault_id]
                </p>
                <p className="text-xs text-foreground break-all">
                  {vaultId ? (
                    <>
                      {vaultId} <span>🔒</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No vault reference</span>
                  )}
                </p>
              </div>

              <Collapsible open={rawOpen} onOpenChange={setRawOpen}>
                <CollapsibleTrigger className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-bio-light inline-flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Raw metadata ({rows?.length ?? 0})
                  <ChevronDown className={`h-3 w-3 transition-transform ${rawOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1 text-[10px]">
                  {rows?.map((r, i) => (
                    <div key={i} className="border-b border-border pb-1">
                      <div className="text-muted-foreground">{r.key}</div>
                      <div className="text-foreground break-all">{r.value}</div>
                    </div>
                  ))}
                  {rows && rows.length === 0 && (
                    <p className="text-muted-foreground">No indexed metadata.</p>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <p className="text-[9px] text-muted-foreground break-all pt-2 border-t border-border">
                contract: {ENVIO_CONTRACT.toLowerCase()}
              </p>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Badge = ({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "active" | "muted";
}) => {
  const cls =
    tone === "active"
      ? "bg-bio-green/15 border-bio-green/40 text-bio-light"
      : tone === "muted"
      ? "bg-muted border-border text-muted-foreground"
      : "bg-carbon-medium border-border text-foreground";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${cls}`}
    >
      {children}
    </span>
  );
};

export default Studio;
