import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { envioQuery, ENVIO_CONTRACT } from "@/utils/envioApi";

interface SidecarDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenId: string;
  name: string;
}

interface MetadataRow {
  key: string;
  value: string;
}

interface MetadataResponse {
  Metadata: MetadataRow[];
}

const QUERY = /* GraphQL */ `
  query GetSidecar($contract: String!, $id: BigInt!) {
    Metadata(where: { tokenContract: { _eq: $contract }, tokenId: { _eq: $id } }) {
      key
      value
    }
  }
`;

export const SidecarDrawer = ({ open, onOpenChange, tokenId, name }: SidecarDrawerProps) => {
  const [rows, setRows] = useState<MetadataRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !tokenId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRows(null);

    envioQuery<MetadataResponse>(QUERY, {
      contract: ENVIO_CONTRACT.toLowerCase(),
      id: tokenId,
    })
      .then((data) => {
        if (!cancelled) setRows(data.Metadata ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to fetch Envio metadata");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, tokenId]);

  const findValue = (k: string) => rows?.find((r) => r.key === k)?.value;
  const ipId = findValue("story[ip_id]");
  const vaultId = findValue("cdr[vault_id]");

  const iframeUrl = `https://ghostagent.ninja/agent/chonk.${tokenId}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[100vw] md:max-w-[1100px] p-0 bg-slate-950 border-slate-900 text-slate-100"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-slate-900">
          <SheetTitle className="text-slate-100 text-sm font-mono">
            Sidecar Inspector · {name} · #{tokenId}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-900">
              <X className="h-4 w-4 mr-1" /> Close
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col md:flex-row h-[calc(100vh-3.25rem)]">
          {/* Left: Agent iframe */}
          <div className="flex-1 bg-black border-r border-slate-900 min-h-[50vh]">
            <iframe
              src={iframeUrl}
              title={`ghostagent ${tokenId}`}
              className="w-full h-full"
              allow="clipboard-read; clipboard-write; web3"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>

          {/* Right: On-Chain HUD */}
          <aside className="w-full md:w-[320px] shrink-0 bg-slate-950 p-4 space-y-4 overflow-y-auto">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                On-Chain Sidecar HUD
              </p>
              <p className="text-xs text-slate-400">
                Envio indexer · live metadata verification
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" /> Querying Envio…
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400 border border-red-900/50 bg-red-950/30 rounded p-2 break-all">
                {error}
              </div>
            )}

            <div className="rounded border border-slate-900 bg-slate-900/40 p-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                Story Protocol IPA Identity
              </p>
              <p className="font-mono text-xs text-slate-100 break-all">
                {ipId ?? <span className="text-slate-500">Unregistered</span>}
              </p>
            </div>

            <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-3">
              <p className="text-[10px] uppercase tracking-widest text-emerald-500/80 mb-1">
                Confidential Data Rail Vault UUID
              </p>
              <p className="font-mono text-xs text-emerald-300 break-all">
                {vaultId ?? <span className="text-emerald-700">No Vault Provisioned</span>}
              </p>
            </div>

            {rows && rows.length > 0 && (
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-300">
                  Raw metadata ({rows.length})
                </summary>
                <div className="mt-2 space-y-1 font-mono">
                  {rows.map((r, i) => (
                    <div key={i} className="border-b border-slate-900 pb-1">
                      <div className="text-slate-500">{r.key}</div>
                      <div className="text-slate-300 break-all">{r.value}</div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="pt-2 text-[10px] text-slate-600 font-mono break-all">
              contract: {ENVIO_CONTRACT.toLowerCase()}
            </div>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
};
