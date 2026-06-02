import { supabase } from "@/integrations/supabase/client";


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

  for (const address of addresses) {
    try {
      // Use Zora's public coin API directly (Base chain id = 8453) to avoid
      // pulling in @zoralabs/coins-sdk, which fails to bundle in the browser.
      const res = await fetch(
        `https://api-sdk.zora.engineering/coin?address=${address}&chain=8453`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      const coin = json?.zora20Token ?? json?.data?.zora20Token;
      const cap = coin?.marketCap;
      if (cap != null) {
        if (typeof cap === 'number') {
          caps[address] = cap.toFixed(2);
        } else if (typeof cap === 'string') {
          caps[address] = cap.replace('$', '');
        } else {
          caps[address] = String(cap);
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch coin for ${address}`, e);
    }
  }

  return caps;
};
