import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alchemyApiKey = Deno.env.get('ALCHEMY_API_KEY');
    const openSeaApiKey = Deno.env.get('OPENSEA_API_KEY');
    const zoraApiKey = Deno.env.get('ZORA_API_KEY');
    
    if (!alchemyApiKey) {
      throw new Error('Alchemy API key not configured');
    }

    if (!zoraApiKey) {
      console.log('Zora API key not configured');
    }

    const { action, contractAddress, tokenIds, chain = 'base', contractAddresses } = await req.json();
    
    console.log(`NFT API call: ${action}`, { contractAddress, tokenIds, chain });

    if (action === 'getNFTMetadata') {
      // Use Alchemy for NFT metadata on Base chain
      const baseUrl = chain === 'base' 
        ? `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`
        : `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;
      
      const nftPromises = tokenIds.map(async (tokenId: string) => {
        const metadataUrl = `${baseUrl}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&refreshCache=false`;
        
        try {
          const response = await fetch(metadataUrl);
          const metadata = await response.json();
          
          // Get OpenSea pricing data if API key is available
          let pricingData = null;
          if (openSeaApiKey) {
            try {
              const openSeaUrl = `https://api.opensea.io/api/v2/chain/${chain}/contract/${contractAddress}/nfts/${tokenId}`;
              const osResponse = await fetch(openSeaUrl, {
                headers: {
                  'X-API-KEY': openSeaApiKey,
                  'Accept': 'application/json'
                }
              });
              
              if (osResponse.ok) {
                pricingData = await osResponse.json();
              }
            } catch (e) {
              console.log(`OpenSea API error for token ${tokenId}:`, e);
            }
          }
          
          return {
            tokenId,
            metadata,
            pricing: pricingData,
            openSeaUrl: `https://opensea.io/item/${chain}/${contractAddress}/${tokenId}`,
            zoraUrl: tokenId === '585' ? 'https://zora.co/@chonk585' : 
                     tokenId === '599' ? 'https://zora.co/@chonk599' : 
                     `https://zora.co/collect/${chain}:${contractAddress}/${tokenId}`
          };
        } catch (error) {
          console.error(`Error fetching data for token ${tokenId}:`, error);
          return {
            tokenId,
            error: error.message,
            openSeaUrl: `https://opensea.io/item/${chain}/${contractAddress}/${tokenId}`,
            zoraUrl: `https://zora.co/collect/${chain}:${contractAddress}/${tokenId}`
          };
        }
      });
      
      const nftData = await Promise.all(nftPromises);
      
      return new Response(
        JSON.stringify({ success: true, data: nftData }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
      );
    }
    
    if (action === 'getZoraPrices') {
      // Fetch Zora creator coin prices and market caps
      const pricePromises = contractAddresses.map(async (contractAddr: string) => {
        try {
          // Try different Zora API endpoints for creator coins (without auth first)
          const endpoints = [
            `https://api.zora.co/discover/tokens/zora:${contractAddr}`,
            `https://api.zora.co/discover/tokens/base:${contractAddr}`,
            `https://zora.co/api/tokens/zora/${contractAddr}`,
            `https://zora.co/api/tokens/base/${contractAddr}`,
            `https://api.zora.co/v1/tokens/base:${contractAddr}`,
            `https://api.zora.co/tokens/base/${contractAddr}`
          ];
          
          for (const endpoint of endpoints) {
            try {
              const headers: Record<string, string> = {
                'Accept': 'application/json'
              };
              if (zoraApiKey) {
                headers['Authorization'] = `Bearer ${zoraApiKey}`;
              }
              
              const response = await fetch(endpoint, { headers });
              
              if (response.ok) {
                const data = await response.json();
                console.log(`Zora API response for ${contractAddr}:`, JSON.stringify(data, null, 2));
                // Attempt to extract price and market cap across possible shapes
                const price = data.token?.market?.price || data.price || data.current_price || null;
                const marketCap = data.token?.market?.market_cap || data.market_cap || data.marketCap || 
                                data.token?.marketCap || data.token?.market_cap || null;
                console.log(`Extracted for ${contractAddr}: price=${price}, marketCap=${marketCap}`);
                return {
                  contractAddress: contractAddr,
                  price,
                  marketCap,
                  success: true
                };
              }
            } catch (e) {
              console.log(`Failed endpoint ${endpoint}:`, e);
            }
          }
        } catch (error) {
          console.error(`Error fetching Zora price for ${contractAddr}:`, error);
        }
        
        return {
          contractAddress: contractAddr,
          price: null,
          marketCap: null,
          success: false
        };
      });
      
      const priceData = await Promise.all(pricePromises);
      
      return new Response(
        JSON.stringify({ success: true, data: priceData }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
      );
    }
    
    // Fallback for other Alchemy API calls
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: req.method,
        params: []
      })
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );

  } catch (error) {
    console.error('Error in alchemy-api function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});