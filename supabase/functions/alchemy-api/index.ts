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
      // For now, return hardcoded market caps for Gone Green items to test the UI
      const hardcodedMarketCaps: Record<string, any> = {
        '0x8bc6e5e303344f5526057df842316ff4c347efd7': { // Gone Green #585
          contractAddress: '0x8bc6e5e303344f5526057df842316ff4c347efd7',
          price: '0.001234',
          marketCap: '686.44',
          success: true
        },
        '0xcbe47fa36e99d11125660262611a1fc998f330b5': { // Gone Green #586
          contractAddress: '0xcbe47fa36e99d11125660262611a1fc998f330b5',
          price: '0.001156',
          marketCap: '542.33',
          success: true
        },
        '0x021594a8005aec083f04b53edf2e57e941086d5e': { // Gone Green #588
          contractAddress: '0x021594a8005aec083f04b53edf2e57e941086d5e',
          price: '0.001089',
          marketCap: '478.12',
          success: true
        },
        '0x09d5b3297545f69a8893bb7a610132354117b66e': { // Gone Green #596
          contractAddress: '0x09d5b3297545f69a8893bb7a610132354117b66e',
          price: '0.001267',
          marketCap: '623.45',
          success: true
        },
        '0xe995b8f87c76614fd094acc971d1651ab82f6a2a': { // Gone Green #599
          contractAddress: '0xe995b8f87c76614fd094acc971d1651ab82f6a2a',
          price: '0.001334',
          marketCap: '712.89',
          success: true
        },
        '0xd0c95dca0101eca9725aed891bda0a2b1a394e38': { // Gone Green #601
          contractAddress: '0xd0c95dca0101eca9725aed891bda0a2b1a394e38',
          price: '0.001445',
          marketCap: '834.56',
          success: true
        },
        '0xdf042a1398377f9ae2d3b482bb2e1aba9bb8da01': { // Gone Green #606
          contractAddress: '0xdf042a1398377f9ae2d3b482bb2e1aba9bb8da01',
          price: '0.001523',
          marketCap: '945.67',
          success: true
        },
        '0xbef0550be11c727cdf0ee6a9b4c6616b0aaff334': { // Gone Green #662
          contractAddress: '0xbef0550be11c727cdf0ee6a9b4c6616b0aaff334',
          price: '0.001678',
          marketCap: '1023.78',
          success: true
        },
        '0x12ea7232bb05e031a0ac588662fac0b2d2a93dbe': { // Gone Green #697
          contractAddress: '0x12ea7232bb05e031a0ac588662fac0b2d2a93dbe',
          price: '0.001789',
          marketCap: '1134.89',
          success: true
        },
        '0xc32913cebf6d266a86e4b613927743171ccd174b': { // Gone Green #9534
          contractAddress: '0xc32913cebf6d266a86e4b613927743171ccd174b',
          price: '0.001890',
          marketCap: '1245.90',
          success: true
        }
      };

      const priceData = contractAddresses.map(contractAddr => {
        const data = hardcodedMarketCaps[contractAddr.toLowerCase()];
        if (data) {
          console.log(`Returning hardcoded data for ${contractAddr}:`, data);
          return data;
        }
        return {
          contractAddress: contractAddr,
          price: null,
          marketCap: null,
          success: false
        };
      });
      
      console.log('Final price data being returned:', priceData);
      
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