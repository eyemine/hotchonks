export const fetchZoraPrices = async (contractAddresses: string[]) => {
  const response = await fetch('https://zxbmbnfpgnkcrjacxegi.supabase.co/functions/v1/alchemy-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getZoraPrices',
      contractAddresses: contractAddresses
    })
  });
  
  if (!response.ok) {
    throw new Error('Zora API failed');
  }
  
  return await response.json();
};

export const extractContractFromZoraUrl = (zoraUrl: string): string | null => {
  const match = zoraUrl.match(/\/coin\/base:([a-fA-F0-9x]+)/);
  return match ? match[1] : null;
};