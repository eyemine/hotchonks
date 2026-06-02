// Lightweight Envio GraphQL client for NFT data fetching.
// Endpoint and target contract come from VITE_ env vars so they stay
// configurable per-environment (still public — safe to expose to the browser).

const ENVIO_GRAPHQL_URL =
  import.meta.env.VITE_ENVIO_GRAPHQL_URL ||
  "https://indexer.envio.dev/v1/graphql";

export const ENVIO_CONTRACT: string =
  import.meta.env.VITE_ENVIO_CONTRACT ||
  "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";

export interface EnvioGraphQLError {
  message: string;
  path?: (string | number)[];
}

export class EnvioGraphQLRequestError extends Error {
  errors: EnvioGraphQLError[];
  constructor(errors: EnvioGraphQLError[]) {
    super(errors.map((e) => e.message).join("; ") || "Envio GraphQL error");
    this.name = "EnvioGraphQLRequestError";
    this.errors = errors;
  }
}

/**
 * Execute a GraphQL query against the configured Envio indexer.
 * Returns the typed `data` payload, or throws on transport/GraphQL errors.
 */
export async function envioQuery<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  init?: RequestInit,
): Promise<TData> {
  const res = await fetch(ENVIO_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify({ query, variables }),
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Envio GraphQL HTTP ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: TData; errors?: EnvioGraphQLError[] };
  if (json.errors?.length) {
    throw new EnvioGraphQLRequestError(json.errors);
  }
  if (!json.data) {
    throw new Error("Envio GraphQL response missing data");
  }
  return json.data;
}

// ---- Example NFT query --------------------------------------------------
// Adjust field/table names to match your Envio indexer schema.

export interface EnvioNFTToken {
  id: string;
  tokenId: string;
  owner?: string | null;
  tokenURI?: string | null;
}

interface TokensResponse {
  Token: EnvioNFTToken[];
}

export async function fetchEnvioTokens(
  tokenIds: (string | number)[],
  contract: string = ENVIO_CONTRACT,
): Promise<EnvioNFTToken[]> {
  const query = /* GraphQL */ `
    query Tokens($contract: String!, $ids: [String!]!) {
      Token(where: { contract: { _eq: $contract }, tokenId: { _in: $ids } }) {
        id
        tokenId
        owner
        tokenURI
      }
    }
  `;
  const data = await envioQuery<TokensResponse>(query, {
    contract: contract.toLowerCase(),
    ids: tokenIds.map(String),
  });
  return data.Token ?? [];
}
