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
          
          // Get OpenSea pricing (listed price) if API key is available
          let pricingData: any = null;
          if (openSeaApiKey) {
            try {
              // Fetch the lowest Seaport listing for this token (v2 Orders API)
              const listingsUrl = `https://api.opensea.io/api/v2/orders/${chain}/seaport/listings?asset_contract_address=${contractAddress}&token_ids=${tokenId}&order_by=eth_price&order_direction=asc&limit=1`;
              const lsResponse = await fetch(listingsUrl, {
                headers: {
                  'X-API-KEY': openSeaApiKey,
                  'Accept': 'application/json'
                }
              });

              if (lsResponse.ok) {
                const lsJson = await lsResponse.json();
                const order = lsJson?.orders?.[0] || lsJson?.listings?.[0] || null;

                const extractDecimal = (o: any): number | null => {
                  if (!o) return null;
                  // Common v2 shapes
                  if (o.price?.decimal != null) return Number(o.price.decimal);
                  if (o.price?.amount?.decimal != null) return Number(o.price.amount.decimal);
                  // Older shapes
                  if (o.current_price) {
                    const n = Number(o.current_price);
                    return isFinite(n) ? n / 1e18 : null;
                  }
                  if (typeof o.price === 'string') {
                    const n = Number(o.price);
                    return isFinite(n) ? n : null;
                  }
                  return null;
                };

                const decimal = extractDecimal(order);
                const currency = order?.price?.currency || order?.price?.currency_address || order?.maker_asset_bundle?.assets?.[0]?.name || 'ETH';

                if (decimal != null) {
                  pricingData = {
                    best_listing: {
                      price: {
                        decimal,
                        currency
                      }
                    },
                    source: 'opensea-v2',
                    raw: order
                  };
                }
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
    
    if (action === 'getContractNFTs') {
      // Get all NFTs from a specific contract
      const baseUrl = chain === 'base' 
        ? `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`
        : `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;
      
      try {
        const nftsUrl = `${baseUrl}/getNFTsForContract?contractAddress=${contractAddress}&withMetadata=true&limit=100`;
        const response = await fetch(nftsUrl);
        const data = await response.json();
        
        if (data.nfts && data.nfts.length > 0) {
          const processedNFTs = data.nfts.map((nft: any) => ({
            tokenId: nft.tokenId,
            title: nft.title || nft.name || `Token #${nft.tokenId}`,
            description: nft.description || '',
            image: nft.image?.originalUrl || nft.image?.cachedUrl || nft.image?.thumbnailUrl || '',
            metadata: nft,
            openSeaUrl: `https://opensea.io/item/${chain}/${contractAddress}/${nft.tokenId}`
          }));
          
          return new Response(
            JSON.stringify({ success: true, data: processedNFTs }),
            {
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              },
            },
          );
        } else {
          return new Response(
            JSON.stringify({ success: false, message: 'No NFTs found in contract' }),
            {
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              },
            },
          );
        }
      } catch (error) {
        console.error(`Error fetching NFTs from contract ${contractAddress}:`, error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message,
            message: 'Failed to fetch NFTs from contract' 
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