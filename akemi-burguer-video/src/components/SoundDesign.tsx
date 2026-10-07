import React from "react";
import { Html5Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { TIMELINE } from "../schema";

type Sfx = "bass-drop" | "sizzle" | "impact" | "whoosh" | "pop" | "kick" | "tap";
type Cue = { at: number; sfx: Sfx; volume?: number };

const { hook, promo, combos, cta } = TIMELINE;

/** Cada cue espelha um momento do roteiro (frames absolutos da composição). */
const CUES: Cue[] = [
  // Cena 1 — bass drop + chapa chiando, impacto em cada palavra
  { at: hook.from, sfx: "bass-drop", volume: 0.9 },
  { at: hook.from, sfx: "sizzle", volume: 0.55 },
  { at: hook.from + 6, sfx: "impact", volume: 0.8 },
  { at: hook.from + 12, sfx: "impact", volume: 0.6 },
  { at: hook.from + 18, sfx: "impact", volume: 0.6 },
  { at: hook.from + 42, sfx: "whoosh", volume: 0.7 },
  { at: hook.from + 46, sfx: "impact", volume: 0.9 },
  { at: hook.from + 58, sfx: "pop", volume: 0.6 },
  // Cena 2 — whoosh do flash, estalo do preço
  { at: promo.from - 6, sfx: "whoosh", volume: 0.8 },
  { at: promo.from + 8, sfx: "impact", volume: 0.7 },
  { at: promo.from + 28, sfx: "whoosh", volume: 0.6 },
  { at: promo.from + 36, sfx: "pop", volume: 0.8 },
  { at: promo.from + 48, sfx: "pop", volume: 0.55 },
  { at: promo.from + 54, sfx: "pop", volume: 0.55 },
  // Cena 3 — batidas sincronizadas com as trocas de foto (a cada 15 frames)
  { at: combos.from - 8, sfx: "whoosh", volume: 0.8 },
  ...[0, 15, 30, 45, 60, 75, 90].map((f): Cue => ({ at: combos.from + f, sfx: "kick", volume: 0.85 })),
  // Cena 4 — íris, toque no botão
  { at: cta.from - 10, sfx: "whoosh", volume: 0.6 },
  { at: cta.from + 8, sfx: "whoosh", volume: 0.5 },
  { at: cta.from + 50, sfx: "pop", volume: 0.7 },
  { at: cta.from + 82, sfx: "tap", volume: 0.9 },
];

export const SoundDesign: React.FC<{ withSfx: boolean; musicSrc: string }> = ({
  withSfx,
  musicSrc,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      {musicSrc ? (
        <Html5Audio
          src={resolveAsset(musicSrc)}
          volume={(f) =>
            interpolate(f, [0, 10, durationInFrames - 20, durationInFrames], [0, 0.6, 0.6, 0], CLAMP)
          }
        />
      ) : null}
      {withSfx
        ? CUES.map((cue, i) => (
            <Sequence key={`${cue.sfx}-${i}`} from={cue.at} name={`SFX ${cue.sfx}`} layout="none">
              <Html5Audio src={staticFile(`sfx/${cue.sfx}.wav`)} volume={cue.volume ?? 1} />
            </Sequence>
          ))
        : null}
    </>
  );
};
