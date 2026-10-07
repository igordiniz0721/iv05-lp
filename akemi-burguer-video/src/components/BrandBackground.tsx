import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CLAMP } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { TIMELINE } from "../schema";

/**
 * Fundo laranja com textura da marca, presente da cena 1 à 3.
 * No gancho a textura "vibra" (jitter + zoom lento); depois só respira.
 */
export const BrandBackground: React.FC<{ textureSrc: string }> = ({
  textureSrc,
}) => {
  const frame = useCurrentFrame();
  const hookEnd = TIMELINE.hook.from + TIMELINE.hook.duration;

  const intensity = interpolate(frame, [0, 8, hookEnd - 10, hookEnd + 10], [14, 7, 5, 1.2], CLAMP);
  const jitterX = Math.sin(frame * 2.3) * intensity;
  const jitterY = Math.cos(frame * 1.7) * intensity;
  const zoom = 1.08 + frame * 0.0004;

  return (
    <AbsoluteFill className="overflow-hidden bg-primary">
      <Img
        src={resolveAsset(textureSrc)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: `translate(${jitterX}px, ${jitterY}px) scale(${zoom})`,
        }}
      />
      {/* tinge a textura com a cor primária editável */}
      <AbsoluteFill className="bg-primary mix-blend-color opacity-60" />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 35%, color-mix(in srgb, var(--akemi-secondary) 55%, transparent) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
