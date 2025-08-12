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
