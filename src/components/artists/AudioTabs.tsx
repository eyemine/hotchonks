import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Lock, Unlock, Loader2, Wallet, AlertTriangle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { connectWallet, getConnectedAddress } from "@/lib/wallet";
import { SpectrogramCanvas } from "./SpectrogramCanvas";
import { PREVIEW_AUDIO_URL, type Artist } from "@/data/artists";
import { CHONKS_CONTRACT } from "@/constants/chonks";

interface Props {
  artist: Artist;
}

export const AudioTabs = ({ artist }: Props) => {
  const previewRef = useRef<HTMLAudioElement>(null);
  const fullRef = useRef<HTMLAudioElement>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const [wallet, setWallet] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [fullPlaying, setFullPlaying] = useState(false);

  useEffect(() => {
    getConnectedAddress().then(setWallet);
  }, []);

  // Autoplay preview on mount (muted-friendly: try, fall back to manual).
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    el.play().then(() => setPreviewPlaying(true)).catch(() => setPreviewPlaying(false));
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setWallet(addr);
      setUnlockError(null);
    } catch (e) {
      setUnlockError(e instanceof Error ? e.message : "Wallet connection failed");
    }
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    setUnlockError(null);
    try {
      let addr = wallet;
      if (!addr) addr = await connectWallet();
      setWallet(addr);

      const { data, error } = await supabase.functions.invoke("cdr-unlock", {
        body: { tokenId: artist.tokenId, walletAddress: addr },
      });

      if (error) throw new Error(error.message);
      if (!data?.unlocked) {
        throw new Error(data?.reason || "Ownership verification failed");
      }
      setFullUrl(data.audioUrl);
    } catch (e) {
      setUnlockError(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="rounded-lg border border-bio-green/20 bg-black/40 p-4">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="bg-carbon-medium border border-bio-green/20">
          <TabsTrigger value="preview" className="font-mono text-xs uppercase tracking-wider">
            Preview
          </TabsTrigger>
          <TabsTrigger value="studio" className="font-mono text-xs uppercase tracking-wider">
            Own
          </TabsTrigger>
        </TabsList>

        {/* PREVIEW TAB */}
        <TabsContent value="preview" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#ffca92] font-mono">
              GhostAgent Preview · Watermarked 30s
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">.wav · public</span>
          </div>

          <div className="relative rounded border border-bio-green/30 overflow-hidden">
            {/* CRT static overlay when paused */}
            {!previewPlaying && (
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.06)_0px,rgba(0,255,65,0.06)_1px,transparent_1px,transparent_3px)] pointer-events-none z-10" />
            )}
            <audio
              ref={previewRef}
              src={PREVIEW_AUDIO_URL}
              controls
              className="w-full bg-black"
              onPlay={() => setPreviewPlaying(true)}
              onPause={() => setPreviewPlaying(false)}
            />
          </div>
        </TabsContent>

        {/* STUDIO TAB */}
        <TabsContent value="studio" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              CDR Vault Status
            </span>
            <span
              className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 ${
                fullUrl ? "text-bio-light" : "text-bio-green"
              }`}
            >
              {fullUrl ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {fullUrl ? "Unlocked" : "Encrypted"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            Owner-Verified Unlock – requires ownership of Base CHONK #{artist.tokenId} NFT{" "}
            <a
              href={`https://opensea.io/item/base/${CHONKS_CONTRACT}/${artist.tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-bio-light hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          {!fullUrl && (
            <div className="space-y-3">
              {!wallet && (
                <Button
                  onClick={handleConnect}
                  variant="outline"
                  className="w-full border-bio-green/40 text-bio-light hover:bg-bio-green/10"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
              {wallet && (
                <p className="text-[10px] font-mono text-muted-foreground break-all">
                  Connected: {wallet}
                </p>
              )}
              <Button
                onClick={handleUnlock}
                disabled={unlocking}
                size="lg"
                className="w-full bg-bio-green text-primary-foreground hover:bg-bio-light font-bold uppercase tracking-widest shadow-[0_0_24px_hsl(var(--bio-green)/0.4)]"
              >
                {unlocking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying ownership…
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Full Track
                  </>
                )}
              </Button>
              {unlockError && (
                <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{unlockError}</span>
                </div>
              )}
            </div>
          )}

          {fullUrl && (
            <div className="space-y-3">
              <audio
                ref={fullRef}
                src={fullUrl}
                controls
                autoPlay
                onPlay={() => setFullPlaying(true)}
                onPause={() => setFullPlaying(false)}
                className="w-full bg-black rounded border border-bio-green/40"
              />
              <SpectrogramCanvas audioElement={fullRef.current} active={fullPlaying} />
              <Button
                asChild
                variant="outline"
                className="w-full border-bio-green/40 text-bio-light hover:bg-bio-green/10"
              >
                <a href={fullUrl} download={`${artist.slug}-master.wav`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Master .wav
                </a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
