import { useState, useEffect } from 'react';
import { ChonkNFT } from '@/types/chonk';
import { BASE_CHONKS } from '@/constants/chonks';
import { fetchNFTDataFromAPI } from '@/utils/nftApi';
import { processAPIData, createFallbackData } from '@/utils/chonkDataProcessor';

// ---- Shared module-level cache ----
// Prevents every component that calls useChonksData() from firing its own
// Alchemy request (which was triggering 429 "concurrent requests exceeded").
const CACHE_KEY = 'chonksData:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6h — chonk art is static, prices can be slightly stale

let memoryCache: ChonkNFT[] | null = null;
let inflight: Promise<ChonkNFT[]> | null = null;
const subscribers = new Set<(data: ChonkNFT[]) => void>();

const readLocalStorage = (): ChonkNFT[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: ChonkNFT[] };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch { return null; }
};

const writeLocalStorage = (data: ChonkNFT[]) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
};

const loadChonks = (): Promise<ChonkNFT[]> => {
  if (memoryCache) return Promise.resolve(memoryCache);
  if (inflight) return inflight;

  // Seed from localStorage so we render instantly on revisits
  const ls = readLocalStorage();
  if (ls && ls.length) {
    memoryCache = ls;
    return Promise.resolve(ls);
  }

  inflight = (async () => {
    try {
      const result = await fetchNFTDataFromAPI(BASE_CHONKS);
      let data = processAPIData(result);
      // If API returned errors for everything (e.g. 429), keep any previous LS data
      const valid = data.filter(d => d.image && !d.image.includes('unsplash'));
      if (valid.length === 0) {
        const stale = (() => { try { const r = localStorage.getItem(CACHE_KEY); return r ? (JSON.parse(r).data as ChonkNFT[]) : null; } catch { return null; } })();
        if (stale && stale.length) data = stale;
        else data = createFallbackData(BASE_CHONKS);
      } else {
        writeLocalStorage(data);
      }
      memoryCache = data;
      return data;
    } catch (err) {
      const fallback = createFallbackData(BASE_CHONKS);
      memoryCache = fallback;
      return fallback;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
};

export const useChonksData = () => {
  const [chonks, setChonks] = useState<ChonkNFT[]>(memoryCache ?? []);
  const [loading, setLoading] = useState<boolean>(!memoryCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const update = (data: ChonkNFT[]) => { if (mounted) setChonks(data); };
    subscribers.add(update);

    if (memoryCache) {
      setChonks(memoryCache);
      setLoading(false);
    } else {
      loadChonks()
        .then((data) => {
          subscribers.forEach((fn) => fn(data));
          if (mounted) setLoading(false);
        })
        .catch((e) => { if (mounted) { setError('Failed to load NFT data'); setLoading(false); } });
    }

    return () => { mounted = false; subscribers.delete(update); };
  }, []);

  return { chonks, loading, error };
};
