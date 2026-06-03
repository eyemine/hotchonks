import { useEffect, useRef } from "react";

interface Props {
  audioElement: HTMLAudioElement | null;
  active: boolean;
}

/**
 * Realtime spectrogram visualization using Web Audio API AnalyserNode.
 * Renders frequency bars in neon green; idle when audio not playing.
 */
export const SpectrogramCanvas = ({ audioElement, active }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioElement || !active) return;

    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audioElement);
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 256;
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
      }
    } catch (err) {
      // Source already connected on this element — analyser stays usable.
      console.warn("Spectrogram init:", err);
    }

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const c2d = canvas.getContext("2d");
    if (!c2d) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const { width, height } = canvas;
      c2d.fillStyle = "rgba(8, 12, 8, 0.35)";
      c2d.fillRect(0, 0, width, height);

      const barWidth = (width / data.length) * 1.6;
      let x = 0;
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 255;
        const barHeight = v * height;
        const hue = 135;
        const light = 35 + v * 35;
        c2d.fillStyle = `hsl(${hue} 100% ${light}%)`;
        c2d.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audioElement, active]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={140}
      className="w-full h-[140px] rounded border border-bio-green/30 bg-black"
    />
  );
};
