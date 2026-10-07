import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * Props editáveis da composição. O schema faz o Remotion Studio exibir um
 * formulário (cores com color picker, textos, caminhos das imagens).
 *
 * Caminhos de imagem aceitam tanto o retorno de staticFile() quanto um
 * caminho relativo a public/ (ex.: "assets/logo-novo.png") ou uma URL.
 */
export const akemiPromoSchema = z.object({
  siteUrl: z.string().min(1),
  city: z.string().min(1),
  logoSrc: z.string(),
  burgerDoubleSrc: z.string(),
  comboBaconSrc: z.string(),
  comboSmashSrc: z.string(),
  bgTextureSrc: z.string(),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  prices: z.object({
    comboDuplo: z.string(),
    comboBacon: z.string(),
    comboSmash: z.string(),
  }),
  withSfx: z.boolean(),
  /** Trilha opcional (ex.: "audio/trilha.mp3" em public/). Vazio = sem trilha. */
  musicSrc: z.string(),
});

export type AkemiPromoProps = z.infer<typeof akemiPromoSchema>;

/** Linha do tempo (30 fps). Mantida em um só lugar para cenas, SFX e transições. */
export const FPS = 30;
export const TIMELINE = {
  hook: { from: 0, duration: 90 },
  promo: { from: 90, duration: 120 },
  combos: { from: 210, duration: 120 },
  cta: { from: 330, duration: 120 },
} as const;
export const TOTAL_FRAMES = TIMELINE.cta.from + TIMELINE.cta.duration; // 450
