import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
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
      // Use Zora official API for creator coin prices/market caps
      const pricePromises = contractAddresses.map(async (contractAddr: string) => {
        try {
          let price: string | null = null;
          let marketCap: string | null = null;

          // 1) Try REST Coins API
          try {
            const restUrl = `https://api.zora.co/coin/v1/coins/base:${contractAddr}`;
            const restResp = await fetch(restUrl, {
              headers: {
                'X-API-KEY': zoraApiKey || '',
                'Accept': 'application/json'
              }
            });

            if (restResp.ok) {
              const j = await restResp.json();
              const pick = (v: any) => (v === 0 || v) ? String(v) : null;
              // Attempt common fields
              price = pick(j?.data?.price?.usd) || pick(j?.data?.priceUsd) || pick(j?.priceUsd) || pick(j?.priceUSD) || pick(j?.price?.usd) || price;
              marketCap = pick(j?.data?.marketCap?.usd) || pick(j?.data?.marketCapUsd) || pick(j?.marketCapUsd) || pick(j?.marketCapUSD) || pick(j?.marketCap?.usd) || marketCap;
            } else {
              console.log(`Zora REST returned ${restResp.status} for ${contractAddr}`);
            }
          } catch (e) {
            console.log(`Zora REST error for ${contractAddr}:`, e);
          }

          // 2) Fallback to GraphQL if needed
          if (!price && !marketCap) {
            try {
              const gqlUrl = 'https://api.zora.co/graphql';
              const gqlQuery = `
                query CoinData($address: String!, $network: Network!) {
                  coin(address: $address, network: $network) {
                    price { usd }
                    marketCap { usd }
                  }
                }
              `;
              const gqlBody = {
                query: gqlQuery,
                variables: { address: contractAddr, network: 'BASE' }
              };

              const gqlResp = await fetch(gqlUrl, {
                method: 'POST',
                headers: {
                  'X-API-KEY': zoraApiKey || '',
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(gqlBody)
              });

              if (gqlResp.ok) {
                const gj = await gqlResp.json();
                const coin = gj?.data?.coin;
                if (coin) {
                  price = coin?.price?.usd != null ? String(coin.price.usd) : price;
                  marketCap = coin?.marketCap?.usd != null ? String(coin.marketCap.usd) : marketCap;
                }
              } else {
                console.log(`Zora GraphQL returned ${gqlResp.status} for ${contractAddr}`);
              }
            } catch (e) {
              console.log(`Zora GraphQL error for ${contractAddr}:`, e);
            }
          }

          return {
            contractAddress: contractAddr,
            price,
            marketCap,
            success: !!(price || marketCap)
          };
        } catch (error) {
          console.error(`Error fetching market data for ${contractAddr}:`, error);
          return {
            contractAddress: contractAddr,
            price: null,
            marketCap: null,
            success: false
          };
        }
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