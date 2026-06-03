// Lightweight injected-wallet helper. No wagmi dependency.
// Used to capture the user's Base address so the cdr-unlock edge function
// can verify ownership of the Chonk NFT.

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet detected. Install MetaMask or a Base-compatible wallet.");
  }
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error("No account returned");
  }
  return accounts[0].toLowerCase();
}

export async function getConnectedAddress(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  try {
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];
    return accounts && accounts.length > 0 ? accounts[0].toLowerCase() : null;
  } catch {
    return null;
  }
}
