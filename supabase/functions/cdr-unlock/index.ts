// CDR Vault Unlock — verifies Base Chonk ownership via Alchemy ownerOf,
// returns a signed audio URL on success. CDR decryption is stubbed at the
// boundary: replace `FULL_TRACK_URL` with the operator-decrypted stream.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CHONKS_CONTRACT = "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9";

// Placeholder audio. Swap to CDR-decrypted stream output later.
const FULL_TRACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

// ERC-721 ownerOf(uint256) selector
const OWNER_OF_SELECTOR = "0x6352211e";

function pad32(hex: string) {
  return hex.replace(/^0x/, "").padStart(64, "0");
}

function decodeAddress(hex: string): string {
  // last 40 hex chars of the 32-byte word
  const stripped = hex.replace(/^0x/, "");
  return ("0x" + stripped.slice(-40)).toLowerCase();
}

async function ownerOf(tokenId: string, apiKey: string): Promise<string> {
  const url = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
  const data =
    OWNER_OF_SELECTOR +
    pad32(BigInt(tokenId).toString(16));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: CHONKS_CONTRACT, data }, "latest"],
    }),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Alchemy non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (json.error) throw new Error(json.error.message || "ownerOf failed");
  if (!json.result || json.result === "0x") throw new Error("Token does not exist");
  return decodeAddress(json.result);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const alchemyKey = Deno.env.get("ALCHEMY_API_KEY");
    if (!alchemyKey) throw new Error("Alchemy API key not configured");

    const body = await req.json().catch(() => ({}));
    const tokenId = String(body?.tokenId ?? "").trim();
    const walletAddress = String(body?.walletAddress ?? "").trim().toLowerCase();

    if (!tokenId || !/^\d+$/.test(tokenId)) {
      return new Response(
        JSON.stringify({ error: "Invalid tokenId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!walletAddress || !/^0x[a-f0-9]{40}$/.test(walletAddress)) {
      return new Response(
        JSON.stringify({ error: "Invalid walletAddress" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const owner = await ownerOf(tokenId, alchemyKey);
    const isOwner = owner === walletAddress;

    if (!isOwner) {
      return new Response(
        JSON.stringify({
          unlocked: false,
          reason: "Wallet does not own this Chonk",
          owner,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        unlocked: true,
        tokenId,
        owner,
        audioUrl: FULL_TRACK_URL,
        vaultId: `cdr-vault-${tokenId}`,
        issuedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("cdr-unlock error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
