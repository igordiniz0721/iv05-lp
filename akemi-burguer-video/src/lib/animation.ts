import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from "remotion";

/** Presets de spring usados em todo o vídeo. */
export const SPRINGS = {
  /** Bounce elástico bem marcado (logo, selos). */
  elastic: { damping: 7, stiffness: 140, mass: 0.7 },
  /** Entrada de impacto para tipografia cinética. */
  punch: { damping: 12, stiffness: 220, mass: 0.6 },
  /** Slides laterais rápidos com leve overshoot. */
  snappy: { damping: 16, stiffness: 190, mass: 0.8 },
  /** Sem overshoot — saídas e movimentos de câmera. */
  smooth: { damping: 200 },
} satisfies Record<string, Partial<SpringConfig>>;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Spring de entrada: 0 → 1 a partir de `delay` (frames locais da cena). */
export const useSpringIn = (
  delay = 0,
  config: Partial<SpringConfig> = SPRINGS.punch,
): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Spring de saída: 0 → 1 a partir de `at`, sem overshoot. Sem `at` = nunca sai. */
export const useSpringOut = (
  at: number | undefined,
  durationInFrames = 12,
): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (at === undefined || frame < at) return 0;
  return spring({
    frame: frame - at,
    fps,
    config: SPRINGS.smooth,
    durationInFrames,
  });
};

/** Oscilação contínua (flutuação, respiração). */
export const wave = (frame: number, period: number, phase = 0): number =>
  Math.sin(((frame + phase) / period) * Math.PI * 2);

/**
 * Pulso de escala que "bate" a cada `period` frames: sobe rápido e
 * relaxa — melhor que um seno puro para botões de CTA.
 */
export const beatPulse = (frame: number, period: number, amount: number) => {
  const t = (((frame % period) + period) % period) / period;
  const kick = t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82;
  return 1 + amount * Math.pow(Math.max(kick, 0), 2);
};

/** Tremor de câmera que decai após um impacto em `at`. */
export const shake = (
  frame: number,
  at: number,
  intensity = 18,
  duration = 10,
) => {
  const local = frame - at;
  if (local < 0 || local > duration) return { x: 0, y: 0 };
  const decay = interpolate(local, [0, duration], [1, 0], CLAMP);
  return {
    x: Math.sin(local * 2.9) * intensity * decay,
    y: Math.cos(local * 3.7) * intensity * 0.7 * decay,
  };
};

/** "Soco" de escala que decai rápido após cada batida (corte no ritmo da música). */
export const beatPunch = (frame: number, beats: number[], amount = 0.08) =>
  beats.reduce((acc, beat) => {
    const t = frame - beat;
    if (t < 0 || t > 10) return acc;
    return acc + amount * Math.exp(-t / 3) * (1 - t / 10);
  }, 0);
