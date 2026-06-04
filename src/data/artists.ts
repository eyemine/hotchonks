// Sovereign IP Pod registry — Virtual Artists.
// Edit this file to add new Chonks or update their Story Protocol / CDR status.

import forkedImg from "@/assets/artists/Forked.jpg.asset.json";
import dollyImg from "@/assets/artists/Dolly.jpg.asset.json";
import kidmanImg from "@/assets/artists/Kidman.jpg.asset.json";
import pearceImg from "@/assets/artists/PearceResugance.jpg.asset.json";
import sandyImg from "@/assets/artists/SandyFreeland.jpg.asset.json";
import ruffImg from "@/assets/artists/Ruff.jpg.asset.json";
import redHammerImg from "@/assets/artists/red_hammer.jpg.asset.json";
import redHammerBanner from "@/assets/artists/redhammer-banner.jpg.asset.json";
import delilahImg from "@/assets/artists/Delilah.jpg.asset.json";
import bluesDandyImg from "@/assets/artists/BluesDandy.jpg.asset.json";

export type ArtistStatus = "active" | "pending" | "unregistered";

export interface Artist {
  slug: string;
  tokenId: string;
  name: string;
  handle: string;
  purebpmUrl: string;
  agentUrl: string;
  genre: string;
  artistImage?: string;
  bannerImage?: string;
  status: ArtistStatus;
  storyIpId?: string;
  cdrActive?: boolean;
  email: string;
  featured?: boolean;
  tba?: string;
  safe?: string;
  owner?: string;
}

export const ARTISTS: Artist[] = [
  {
    slug: "red-hammer",
    tokenId: "697",
    name: "Red Hammer",
    handle: "@red-hammer",
    purebpmUrl: "https://www.purebpm.com/@red-hammer",
    agentUrl: "https://ghostagent.ninja/agent/chonk.697",
    genre: "Industrial Breakbeat / G Minor",
    artistImage: redHammerImg.url,
    bannerImage: redHammerBanner.url,
    status: "active",
    storyIpId: "0x7832e3EC9c433D722A8bd659B0C0829Dc4910b21",
    cdrActive: true,
    email: "chonk.697_@nftmail.box",
    featured: true,
  },
  {
    slug: "delilah",
    tokenId: "676",
    name: "Delilah",
    handle: "@delilah",
    purebpmUrl: "https://www.purebpm.com/@delilah",
    agentUrl: "https://ghostagent.ninja/agent/chonk.676",
    genre: "Dream Pop / Synth",
    artistImage: delilahImg.url,
    status: "pending",
    email: "chonk.676_@nftmail.box",
  },
  {
    slug: "sandy-freeland",
    tokenId: "678",
    name: "Sandy Freeland",
    handle: "@sandy-freeland",
    purebpmUrl: "https://www.purebpm.com/@sandy-freeland",
    agentUrl: "https://ghostagent.ninja/agent/chonk.678",
    genre: "Desert Folk",
    artistImage: sandyImg.url,
    status: "pending",
    email: "chonk.678_@nftmail.box",
  },
  {
    slug: "forked",
    tokenId: "599",
    name: "Forked",
    handle: "@forked",
    purebpmUrl: "https://www.purebpm.com/@forked",
    agentUrl: "https://ghostagent.ninja/agent/chonk.599",
    genre: "Glitch / IDM",
    artistImage: forkedImg.url,
    status: "pending",
    email: "chonk.599_@nftmail.box",
  },
  {
    slug: "ruff",
    tokenId: "601",
    name: "Ruff",
    handle: "@ruff",
    purebpmUrl: "https://www.purebpm.com/@ruff",
    agentUrl: "https://ghostagent.ninja/agent/chonk.601",
    genre: "Lo-Fi Hip Hop",
    artistImage: ruffImg.url,
    status: "pending",
    email: "chonk.601_@nftmail.box",
  },
  {
    slug: "dolly",
    tokenId: "681",
    name: "Dolly",
    handle: "@dolly",
    purebpmUrl: "https://www.purebpm.com/@dolly",
    agentUrl: "https://ghostagent.ninja/agent/chonk.681",
    genre: "Country Pop",
    artistImage: dollyImg.url,
    status: "pending",
    email: "chonk.681_@nftmail.box",
  },
  {
    slug: "kidman",
    tokenId: "9534",
    name: "Kidman",
    handle: "@kidman",
    purebpmUrl: "https://www.purebpm.com/@kidman",
    agentUrl: "https://ghostagent.ninja/agent/chonk.9534",
    genre: "Cinematic Ambient",
    artistImage: kidmanImg.url,
    status: "pending",
    email: "chonk.9534_@nftmail.box",
  },
  {
    slug: "pearce-resurgance",
    tokenId: "588",
    name: "Pearce Resurgance",
    handle: "@pearce-resurgance",
    purebpmUrl: "https://www.purebpm.com/@pearce-resurgance",
    agentUrl: "https://ghostagent.ninja/agent/chonk.588",
    genre: "Post-Rock",
    artistImage: pearceImg.url,
    status: "unregistered",
    email: "chonk.588_@nftmail.box",
  },
  {
    slug: "blues-dandy",
    tokenId: "606",
    name: "Blues Dandy",
    handle: "@blues-dandy",
    purebpmUrl: "https://www.purebpm.com/@blues-dandy",
    agentUrl: "https://ghostagent.ninja/agent/chonk.606",
    genre: "Electric Blues",
    artistImage: bluesDandyImg.url,
    status: "unregistered",
    email: "chonk.606_@nftmail.box",
  },
];

export const getArtistBySlug = (slug: string) =>
  ARTISTS.find((a) => a.slug === slug);

export const truncateAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—";

export const PREVIEW_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";
