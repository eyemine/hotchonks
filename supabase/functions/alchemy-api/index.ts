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
      // Web scraping approach for Zora creator coin market caps
      const pricePromises = contractAddresses.map(async (contractAddr: string) => {
        try {
          console.log(`Scraping market data for contract ${contractAddr}`);
          
          const pageUrl = `https://zora.co/coin/base:${contractAddr}`;
          const pageResponse = await fetch(pageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
          
          if (pageResponse.ok) {
            const html = await pageResponse.text();
            console.log(`Scraped ${html.length} characters for ${contractAddr}`);
            
            // Multiple patterns to find market cap
            const patterns = [
              /Market Cap[^$]*\$([0-9,]+\.?[0-9]*)/i,
              /\$([0-9,]+\.?[0-9]*)[^0-9]*market cap/i,
              /"marketCap"\s*:\s*"?([0-9,]+\.?[0-9]*)"?/i,
              /market[^$]*cap[^$]*\$([0-9,]+\.?[0-9]*)/i,
              /\$([0-9,]+\.?[0-9]*)[^0-9]*Market/i
            ];
            
            let marketCap = null;
            for (const pattern of patterns) {
              const match = html.match(pattern);
              if (match) {
                marketCap = match[1].replace(/,/g, '');
                console.log(`Found market cap for ${contractAddr}: $${marketCap} using pattern`);
                break;
              }
            }
            
            // Also try to find price patterns
            const pricePatterns = [
              /price[^$]*\$([0-9,]+\.?[0-9]*)/i,
              /"price"\s*:\s*"?([0-9,]+\.?[0-9]*)"?/i
            ];
            
            let price = null;
            for (const pattern of pricePatterns) {
              const match = html.match(pattern);
              if (match) {
                price = match[1].replace(/,/g, '');
                console.log(`Found price for ${contractAddr}: $${price}`);
                break;
              }
            }
            
            if (marketCap || price) {
              return {
                contractAddress: contractAddr,
                price: price,
                marketCap: marketCap,
                success: true
              };
            } else {
              console.log(`No market data found in HTML for ${contractAddr}`);
            }
          } else {
            console.log(`Failed to fetch page for ${contractAddr}: ${pageResponse.status}`);
          }
          
        } catch (error) {
          console.error(`Error scraping data for ${contractAddr}:`, error);
        }
        
        // Return null data if scraping fails
        return {
          contractAddress: contractAddr,
          price: null,
          marketCap: null,
          success: false
        };
      });
      
      const priceData = await Promise.all(pricePromises);
      console.log('Final scraped price data:', priceData);
      
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