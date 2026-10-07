import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, SPRINGS } from "../lib/animation";

/*
 * Transições de sobreposição. Cada uma roda dentro de um <Sequence> centrado
 * no corte entre cenas: o meio da sequência é o frame em que a cena troca, e é
 * nesse instante que a tela fica totalmente coberta.
 */

/** Cena 1 → 2: flash branco com explosão radial amarela. */
export const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;

  const flash = interpolate(frame, [0, mid, durationInFrames], [0, 1, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const burst = interpolate(frame, [mid - 4, mid + 6], [0, 2.4], CLAMP);

  return (
    <AbsoluteFill className="pointer-events-none">
      <AbsoluteFill
        style={{
          opacity: flash * 0.9,
          transform: `scale(${burst})`,
          background:
            "radial-gradient(circle, var(--akemi-accent) 0%, color-mix(in srgb, var(--akemi-accent) 0%, transparent) 60%)",
        }}
      />
      <AbsoluteFill className="bg-white" style={{ opacity: flash }} />
    </AbsoluteFill>
  );
};

/**
 * Cena 2 → 3: três faixas diagonais varrendo a tela da esquerda para a
 * direita. As bordas dianteiras ficam escalonadas (amarelo → laranja →
 * marrom) e as traseiras também (marrom sai antes), então as listras
 * aparecem na entrada e na saída, com a tela 100% marrom no corte.
 */
export const StripeWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  const STEP = 170; // distância entre as bordas das faixas
  const SKEW = 14;
  const slack = Math.tan((SKEW * Math.PI) / 180) * (height / 2); // deslocamento do skew
  const brownWidth = width + slack * 2 + STEP;

  // Borda dianteira da faixa amarela (a que vai na frente).
  // Entra em velocidade constante, cobre a tela no corte e acelera na saída,
  // revelando a cena 3.
  const start = -slack;
  const cover = width + slack + STEP * 2 + 20; // marrom cobre tudo a partir daqui
  const end = width + slack + brownWidth + STEP * 4 + slack;
  const lead =
    frame < mid
      ? interpolate(frame, [0, mid], [start, cover], CLAMP)
      : interpolate(frame, [mid, durationInFrames], [cover, end], { ...CLAMP, easing: Easing.in(Easing.quad) });

  const bars = [
    { color: "bg-accent", offset: 0, extra: STEP * 4 },
    { color: "bg-primary", offset: STEP, extra: STEP * 2 },
    { color: "bg-secondary", offset: STEP * 2, extra: 0 },
  ];

  return (
    <AbsoluteFill className="pointer-events-none overflow-hidden">
      {bars.map(({ color, offset, extra }) => {
        const barWidth = brownWidth + extra;
        const right = lead - offset; // borda dianteira desta faixa
        return (
          <div
            key={color}
            className={`absolute top-0 ${color}`}
            style={{
              left: 0,
              width: barWidth,
              height,
              transform: `translateX(${right - barWidth}px) skewX(-${SKEW}deg)`,
              boxShadow: "0 0 60px rgba(0,0,0,0.35)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Cena 3 → 4: íris marrom com borda amarela fechando sobre a cena (corte limpo). */
export const IrisTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  const diagonal = Math.hypot(width, height);

  const grow = spring({ frame, fps, config: SPRINGS.smooth, durationInFrames: mid });
  const size = grow * diagonal * 1.05;
  const fade = interpolate(frame, [mid, durationInFrames], [1, 0], CLAMP);

  return (
    <AbsoluteFill className="pointer-events-none items-center justify-center" style={{ opacity: fade }}>
      <div
        className="rounded-full bg-secondary"
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          boxShadow: `0 0 0 ${28 * (1 - grow) + 6}px var(--akemi-accent), 0 0 80px 30px rgba(0,0,0,0.4)`,
        }}
      />
    </AbsoluteFill>
  );
};
