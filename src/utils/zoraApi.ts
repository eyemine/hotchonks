import { supabase } from "@/integrations/supabase/client";
import { getCoin } from "@zoralabs/coins-sdk";

export const fetchZoraPrices = async (contractAddresses: string[]) => {
  const { data, error } = await supabase.functions.invoke('alchemy-api', {
    body: {
      action: 'getZoraPrices',
      contractAddresses,
    }
  });

  if (error) {
    throw new Error(error.message || 'Zora API failed');
  }

  return data;
};

export const extractContractFromZoraUrl = (zoraUrl: string): string | null => {
  // Support legacy /coin/base:<contract> URLs only (preferred is explicit contractAddress in data)
  const match = zoraUrl.match(/\/coin\/base:([a-fA-F0-9x]+)/);
  return match ? match[1] : null;
};

// Fetch market caps for Gone Green coins using Zora Coins SDK directly (Base is default)
export const fetchGoneGreenMarketCaps = async (
  contractAddresses: string[]
): Promise<Record<string, string>> => {
  const caps: Record<string, string> = {};

  // Deduplicate and validate addresses
  const addresses = Array.from(new Set(
    (contractAddresses || []).filter((a) => typeof a === 'string' && a.startsWith('0x'))
  ));

  // Skip SDK calls in development to prevent console spam
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping Zora SDK calls in development to prevent console errors');
    return caps;
  }

  for (const address of addresses) {
    try {
      const res = await getCoin({ address });
      const coin = (res as any)?.data?.zora20Token;
      const cap = coin?.marketCap;
      if (cap != null) {
        if (typeof cap === 'number') {
          caps[address] = cap.toFixed(2);
        } else if (typeof cap === 'string') {
          // Strip any leading $ then keep numeric string
          caps[address] = cap.replace('$', '');
        } else {
          caps[address] = String(cap);
        }
      }
    } catch (e) {
      // Suppress excessive logging in development
      if (process.env.NODE_ENV !== 'development') {
        console.warn(`Failed to fetch coin via SDK for ${address}`, e);
      }
    }
  }

  return caps;
};
