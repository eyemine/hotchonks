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
  /** Genre / musical descriptor */
  genre: string;
  /** Optional hero portrait override (defaults to Chonk NFT image) */
  heroImage?: string;
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
    genre: "Industrial Breakbeat / G Minor",
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
    genre: "Dream Pop / Synth",
    status: "pending",
    email: "chonk.676_@nftmail.box",
  },
  {
    slug: "sandy-freeland",
    tokenId: "678",
    name: "SANDY FREELAND",
    handle: "@sandy-freeland",
    purebpmUrl: "https://www.purebpm.com/@sandy-freeland",
    genre: "Desert Folk",
    status: "pending",
    email: "chonk.678_@nftmail.box",
  },
  {
    slug: "forked",
    tokenId: "599",
    name: "FORKED",
    handle: "@forked",
    purebpmUrl: "https://www.purebpm.com/@forked",
    genre: "Glitch / IDM",
    status: "pending",
    email: "chonk.599_@nftmail.box",
  },
  {
    slug: "pearce-resurgance",
    tokenId: "588",
    name: "PEARCE RESURGANCE",
    handle: "@pearce-resurgance",
    purebpmUrl: "https://www.purebpm.com/@pearce-resurgance",
    genre: "Post-Rock",
    status: "unregistered",
    email: "chonk.588_@nftmail.box",
  },
  {
    slug: "blues-dandy",
    tokenId: "606",
    name: "BLUES DANDY",
    handle: "@blues-dandy",
    purebpmUrl: "https://www.purebpm.com/@blues-dandy",
    genre: "Electric Blues",
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
