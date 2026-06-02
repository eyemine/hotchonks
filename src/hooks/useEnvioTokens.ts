import { useEffect, useState } from "react";
import { fetchEnvioTokens, type EnvioNFTToken } from "@/utils/envioApi";

/**
 * React hook to fetch NFT tokens from the Envio indexer.
 * Pass an array of token IDs and (optionally) a contract override.
 */
export function useEnvioTokens(tokenIds: (string | number)[], contract?: string) {
  const [tokens, setTokens] = useState<EnvioNFTToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = `${contract ?? ""}:${tokenIds.join(",")}`;

  useEffect(() => {
    if (tokenIds.length === 0) {
      setTokens([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEnvioTokens(tokenIds, contract)
      .then((data) => {
        if (!cancelled) setTokens(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error("Envio fetch failed:", err);
          setError(err instanceof Error ? err.message : "Envio fetch failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { tokens, loading, error };
}
