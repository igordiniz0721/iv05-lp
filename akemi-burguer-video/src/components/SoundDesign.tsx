import React from "react";
import { Html5Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { sec, TIMELINE } from "../schema";

type Sfx = "bass-drop" | "sizzle" | "impact" | "whoosh" | "pop" | "kick" | "tap";
type Cue = { at: number; sfx: Sfx; volume?: number };

const { promo, combos, more, cta } = TIMELINE;

/**
 * SFX nos momentos do roteiro (frames absolutos). Ficam baixos para não
 * brigar com a locução da cliente.
 */
const CUES: Cue[] = [
  // Gancho — bass drop + chapa chiando, impactos nas palavras fortes
  { at: 0, sfx: "bass-drop", volume: 0.7 },
  { at: 0, sfx: "sizzle", volume: 0.35 },
  { at: sec(2.18), sfx: "impact", volume: 0.4 },
  { at: sec(2.58), sfx: "impact", volume: 0.35 },
  { at: sec(3.04), sfx: "impact", volume: 0.35 },
  { at: sec(3.8), sfx: "whoosh", volume: 0.4 },
  { at: sec(4.46), sfx: "impact", volume: 0.45 },
  { at: sec(5.56), sfx: "pop", volume: 0.45 },
  // Combo duplo — whoosh do flash, estalos nos itens e no preço
  { at: promo.from - 6, sfx: "whoosh", volume: 0.5 },
  { at: sec(7.9), sfx: "impact", volume: 0.45 },
  { at: sec(11.15), sfx: "pop", volume: 0.45 },
  { at: sec(12.5), sfx: "pop", volume: 0.45 },
  { at: sec(13.0), sfx: "whoosh", volume: 0.4 },
  { at: sec(13.9), sfx: "impact", volume: 0.5 },
  // Bacon ou smash — whoosh do wipe e pops dos cards
  { at: combos.from - 8, sfx: "whoosh", volume: 0.5 },
  { at: sec(16.45), sfx: "pop", volume: 0.45 },
  { at: sec(17.65), sfx: "pop", volume: 0.45 },
  { at: sec(18.7), sfx: "impact", volume: 0.4 },
  // Outros lanches — um kick em cada troca do carrossel
  { at: more.from - 6, sfx: "whoosh", volume: 0.5 },
  ...new Array(8).fill(0).map((_, i): Cue => ({ at: sec(20.56) + i * 10, sfx: "kick", volume: 0.45 })),
  { at: sec(22.34), sfx: "impact", volume: 0.5 },
  // CTA — pergunta, íris, toque no botão
  { at: cta.from - 10, sfx: "whoosh", volume: 0.5 },
  { at: sec(24.5), sfx: "impact", volume: 0.6 },
  { at: sec(25.2), sfx: "whoosh", volume: 0.45 },
  { at: sec(27.2), sfx: "pop", volume: 0.5 },
  { at: sec(28.28), sfx: "tap", volume: 0.7 },
];

/** Trechos com fala (s) — a trilha abaixa ("ducking") enquanto a cliente fala. */
const SPEECH: [number, number][] = [
  [1.4, 7.5],
  [7.7, 15.4],
  [16.0, 19.6],
  [20.2, 24.0],
  [24.1, 24.95],
  [25.3, 28.9],
];

export const SoundDesign: React.FC<{
  voiceoverSrc: string;
  musicSrc: string;
  withSfx: boolean;
}> = ({ voiceoverSrc, musicSrc, withSfx }) => {
  const { durationInFrames, fps } = useVideoConfig();

  const musicVolume = (f: number) => {
    const t = f / fps;
    const speaking = SPEECH.some(([a, b]) => t >= a - 0.1 && t <= b + 0.1);
    const fadeOut = interpolate(f, [durationInFrames - 30, durationInFrames], [1, 0], CLAMP);
    return (speaking ? 0.2 : 0.42) * fadeOut;
  };

  return (
    <>
      {voiceoverSrc ? <Html5Audio src={resolveAsset(voiceoverSrc)} volume={1} name="Locução" /> : null}
      {musicSrc ? <Html5Audio src={resolveAsset(musicSrc)} volume={musicVolume} name="Trilha" /> : null}
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
