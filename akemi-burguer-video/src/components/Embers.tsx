import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

/** Fagulhas subindo da chapa — partículas determinísticas (mesmo seed = mesmo vídeo). */
export const Embers: React.FC<{
  count?: number;
  seed?: string;
  opacity?: number;
}> = ({ count = 26, seed = "embers", opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill className="pointer-events-none" style={{ opacity }}>
      {new Array(count).fill(true).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const speed = 4 + r("speed") * 9;
        const size = 5 + r("size") * 12;
        const travel = height + 200;
        const y = height + 60 - ((frame * speed + r("offset") * travel) % travel);
        const x =
          r("x") * width + Math.sin((frame + r("phase") * 100) / (12 + r("w") * 10)) * 30;
        const flicker = 0.55 + 0.45 * Math.sin(frame * (0.4 + r("f")) + i);
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              opacity: flicker,
              background:
                "radial-gradient(circle, #fff6c8 0%, var(--akemi-accent) 45%, transparent 72%)",
              boxShadow: "0 0 18px 4px color-mix(in srgb, var(--akemi-accent) 60%, transparent)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
