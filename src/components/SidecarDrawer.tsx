import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Loader2, AlertTriangle, RefreshCw, Database, Radio } from "lucide-react";
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

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-slate-500/20" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-300">Fetching on-chain metadata</p>
        <p className="text-xs text-slate-500">Envio indexer · real-time GraphQL query</p>
      </div>
      <div className="w-full space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded border border-slate-800 bg-slate-900/30 p-3 animate-pulse">
            <div className="h-3 w-24 bg-slate-800 rounded mb-2" />
            <div className="h-4 w-full bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="rounded-full bg-red-950/40 p-3 border border-red-900/50">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-red-300">Indexer query failed</p>
        <p className="text-xs text-red-400/70 break-all max-w-[260px]">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-red-900/50 text-red-300 hover:text-red-200 hover:bg-red-950/30 hover:border-red-800"
      >
        <RefreshCw className="h-3 w-3 mr-2" />
        Retry Query
      </Button>
    </div>
  );
}

function EmptyState({ tokenId }: { tokenId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="rounded-full bg-slate-900/60 p-3 border border-slate-800">
        <Database className="h-6 w-6 text-slate-500" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-400">No metadata found</p>
        <p className="text-xs text-slate-500">Token #{tokenId} has no indexed sidecar data yet</p>
      </div>
      <div className="rounded border border-slate-800 bg-slate-900/30 p-3 w-full">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Contract</p>
        <p className="font-mono text-[10px] text-slate-500 break-all">{ENVIO_CONTRACT.toLowerCase()}</p>
      </div>
    </div>
  );
}

export const SidecarDrawer = ({ open, onOpenChange, tokenId, name }: SidecarDrawerProps) => {
  const [rows, setRows] = useState<MetadataRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const fetchData = () => {
    if (!open || !tokenId) return;
    setLoading(true);
    setError(null);
    setRows(null);

    envioQuery<MetadataResponse>(QUERY, {
      contract: ENVIO_CONTRACT.toLowerCase(),
      id: tokenId,
    })
      .then((data) => {
        setRows(data.Metadata ?? []);
      })
      .catch((err) => {
        setError(err?.message || "Failed to fetch Envio metadata");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
  }, [open, tokenId, attemptCount]);

  const handleRetry = () => {
    setAttemptCount((c) => c + 1);
  };

  const findValue = (k: string) => rows?.find((r) => r.key === k)?.value;
  const ipId = findValue("story[ip_id]");
  const vaultId = findValue("cdr[vault_id]");

  const iframeUrl = `https://ghostagent.ninja/agent/chonk.${tokenId}`;

  const hasData = rows && rows.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[100vw] md:max-w-[1100px] p-0 bg-slate-950 border-slate-900 text-slate-100"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-slate-900">
          <SheetTitle className="text-slate-100 text-sm font-mono flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-500" />
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
          <div className="flex-1 bg-black border-r border-slate-900 min-h-[40vh] md:min-h-0">
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
            {/* HUD Header */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                On-Chain Sidecar HUD
              </p>
              <p className="text-xs text-slate-400">
                Envio indexer · live metadata verification
              </p>
            </div>

            {/* Status Divider */}
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : error ? 'bg-red-500' : hasData ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                {loading ? 'Syncing…' : error ? 'Query Failed' : hasData ? 'Live' : 'No Data'}
              </span>
            </div>

            {/* Content States */}
            {loading && <LoadingState />}

            {!loading && error && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {!loading && !error && rows && rows.length === 0 && (
              <EmptyState tokenId={tokenId} />
            )}

            {!loading && !error && hasData && (
              <>
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

                {rows.length > 0 && (
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
              </>
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
