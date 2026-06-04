// Sovereign IP Pod registry — Virtual Artists.
// Edit this file to add new Chonks or update their Story Protocol / CDR status.

export type ArtistStatus = "active" | "pending" | "unregistered";

export interface Artist {
  /** Route slug — e.g. /studio/red-hammer */
  slug: string;
  /** On-chain token id on Base Chonks contract */
  tokenId: string;
  /** Display name (artist persona) */
  name: string;
  /** Pixel chonk handle */
  handle: string;
  /** PureBPM profile URL */
  purebpmUrl: string;
  /** GhostAgent agent URL */
  agentUrl: string;
  /** Genre / musical descriptor */
  genre: string;
  /** Inset portrait overlaid on the Chonk pixel image (drop file in /public/artists/) */
  artistImage?: string;
  /** Optional hero banner image (drop file in /public/artists/) */
  bannerImage?: string;
  status: ArtistStatus;
  storyIpId?: string;
  cdrActive?: boolean;
  email: string;
  /** Featured on the roster (1.5x card width) */
  featured?: boolean;
  /** ERC-6551 TBA, Safe, owner addresses for the Protocol Infrastructure accordion */
  tba?: string;
  safe?: string;
  owner?: string;
}

export const ARTISTS: Artist[] = [
  {
    slug: "red-hammer",
    tokenId: "697",
    name: "RED HAMMER",
    handle: "@red-hammer",
    purebpmUrl: "https://www.purebpm.com/@red-hammer",
    agentUrl: "https://ghostagent.ninja/agent/chonk.697",
    genre: "Industrial Breakbeat / G Minor",
    artistImage: "/artists/red-hammer.jpg",
    bannerImage: "/artists/redhammer-banner.jpg",
    status: "active",
    storyIpId: "0x7832e3EC9c433D722A8bd659B0C0829Dc4910b21",
    cdrActive: true,
    email: "chonk.697_@nftmail.box",
    featured: true,
  },
  {
    slug: "delilah",
    tokenId: "676",
    name: "DELILAH",
    handle: "@delilah",
    purebpmUrl: "https://www.purebpm.com/@delilah",
    agentUrl: "https://ghostagent.ninja/agent/chonk.676",
    genre: "Dream Pop / Synth",
    artistImage: "/artists/Delilah.png",
    status: "pending",
    email: "chonk.676_@nftmail.box",
  },
  {
    slug: "sandy-freeland",
    tokenId: "678",
    name: "SANDY FREELAND",
    handle: "@sandy-freeland",
    purebpmUrl: "https://www.purebpm.com/@sandy-freeland",
    agentUrl: "https://ghostagent.ninja/agent/chonk.678",
    genre: "Desert Folk",
    artistImage: "/artists/SandyFreeland.png",
    status: "pending",
    email: "chonk.678_@nftmail.box",
  },
  {
    slug: "forked",
    tokenId: "599",
    name: "FORKED",
    handle: "@forked",
    purebpmUrl: "https://www.purebpm.com/@forked",
    agentUrl: "https://ghostagent.ninja/agent/chonk.599",
    genre: "Glitch / IDM",
    artistImage: "/artists/Forked.png",
    status: "pending",
    email: "chonk.599_@nftmail.box",
  },
  {
    slug: "ruff",
    tokenId: "601",
    name: "RUFF",
    handle: "@ruff",
    purebpmUrl: "https://www.purebpm.com/@ruff",
    agentUrl: "https://ghostagent.ninja/agent/chonk.601",
    genre: "Lo-Fi Hip Hop",
    artistImage: "/artists/Ruff.png",
    status: "pending",
    email: "chonk.601_@nftmail.box",
  },
  {
    slug: "dolly",
    tokenId: "681",
    name: "DOLLY",
    handle: "@dolly",
    purebpmUrl: "https://www.purebpm.com/@dolly",
    agentUrl: "https://ghostagent.ninja/agent/chonk.681",
    genre: "Country Pop",
    artistImage: "/artists/Dolly.png",
    status: "pending",
    email: "chonk.681_@nftmail.box",
  },
  {
    slug: "kidman",
    tokenId: "9534",
    name: "KIDMAN",
    handle: "@kidman",
    purebpmUrl: "https://www.purebpm.com/@kidman",
    agentUrl: "https://ghostagent.ninja/agent/chonk.9534",
    genre: "Cinematic Ambient",
    artistImage: "/artists/Kidman.png",
    status: "pending",
    email: "chonk.9534_@nftmail.box",
  },
  {
    slug: "pearce-resurgance",
    tokenId: "588",
    name: "PEARCE RESURGANCE",
    handle: "@pearce-resurgance",
    purebpmUrl: "https://www.purebpm.com/@pearce-resurgance",
    agentUrl: "https://ghostagent.ninja/agent/chonk.588",
    genre: "Post-Rock",
    artistImage: "/artists/PearceResurgance.png",
    status: "unregistered",
    email: "chonk.588_@nftmail.box",
  },
  {
    slug: "blues-dandy",
    tokenId: "606",
    name: "BLUES DANDY",
    handle: "@blues-dandy",
    purebpmUrl: "https://www.purebpm.com/@blues-dandy",
    agentUrl: "https://ghostagent.ninja/agent/chonk.606",
    genre: "Electric Blues",
    artistImage: "/artists/BluesDandy.png",
    status: "unregistered",
    email: "chonk.606_@nftmail.box",
  },
];

export const getArtistBySlug = (slug: string) =>
  ARTISTS.find((a) => a.slug === slug);

export const truncateAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—";

// Placeholder preview audio (30s watermarked stand-in).
// Swap to the real preview_misbehaved.wav once hosted.
export const PREVIEW_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";
