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
      // Fetch real Zora creator coin data using contract addresses
      const pricePromises = contractAddresses.map(async (contractAddr: string) => {
        try {
          // Try to fetch market data from Zora's API
          const zoraUrl = `https://api.zora.co/discover/markets/base:${contractAddr}`;
          
          console.log(`Fetching market data for ${contractAddr} from: ${zoraUrl}`);
          
          const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': 'Chonks-NFT-App/1.0'
          };
          
          if (zoraApiKey) {
            headers['Authorization'] = `Bearer ${zoraApiKey}`;
          }
          
          const response = await fetch(zoraUrl, { headers });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Zora market data for ${contractAddr}:`, JSON.stringify(data, null, 2));
            
            // Extract market data from the response
            let price = null;
            let marketCap = null;
            
            if (data.market) {
              price = data.market.price || data.market.current_price;
              marketCap = data.market.market_cap || data.market.marketCap;
            } else if (data.token) {
              price = data.token.price || data.token.current_price;
              marketCap = data.token.market_cap || data.token.marketCap;
            }
            
            // If we got data, format it properly
            if (price || marketCap) {
              return {
                contractAddress: contractAddr,
                price: price ? String(price) : null,
                marketCap: marketCap ? String(marketCap) : null,
                success: true
              };
            }
          } else {
            console.log(`Zora API returned ${response.status} for ${contractAddr}`);
          }
          
          // Fallback: Try alternative endpoint
          const altUrl = `https://api.zora.co/tokens/base:${contractAddr}`;
          console.log(`Trying alternative endpoint: ${altUrl}`);
          
          const altResponse = await fetch(altUrl, { headers });
          if (altResponse.ok) {
            const altData = await altResponse.json();
            console.log(`Alternative Zora data for ${contractAddr}:`, JSON.stringify(altData, null, 2));
            
            const price = altData.price || altData.current_price;
            const marketCap = altData.market_cap || altData.marketCap;
            
            if (price || marketCap) {
              return {
                contractAddress: contractAddr,
                price: price ? String(price) : null,
                marketCap: marketCap ? String(marketCap) : null,
                success: true
              };
            }
          }
          
        } catch (error) {
          console.error(`Error fetching Zora data for ${contractAddr}:`, error);
        }
        
        // Return null data if API calls fail
        return {
          contractAddress: contractAddr,
          price: null,
          marketCap: null,
          success: false
        };
      });
      
      const priceData = await Promise.all(pricePromises);
      console.log('Final Zora price data:', priceData);
      
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