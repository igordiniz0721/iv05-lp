import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * Props editáveis da composição. O schema faz o Remotion Studio exibir um
 * formulário (cores com color picker, textos, caminhos das imagens).
 *
 * Caminhos de imagem/áudio aceitam tanto o retorno de staticFile() quanto um
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
  /** Print do cardápio digital (rola dentro do celular na cena final). */
  siteScreenshotSrc: z.string(),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  prices: z.object({
    comboDuplo: z.string(),
    comboBacon: z.string(),
    comboSmash: z.string(),
  }),
  /** Outros lanches do cardápio para o carrossel "temos muito mais". */
  moreBurgers: z.array(
    z.object({ name: z.string(), price: z.string(), src: z.string() }),
  ),
  /** Locução da cliente. A linha do tempo (TIMELINE) segue essa fala. */
  voiceoverSrc: z.string(),
  /** Trilha de fundo (vazio = sem trilha). */
  musicSrc: z.string(),
  withSfx: z.boolean(),
});

export type AkemiPromoProps = z.infer<typeof akemiPromoSchema>;

export const FPS = 30;
/** Converte segundos da locução em frames. */
export const sec = (s: number) => Math.round(s * FPS);

/**
 * Linha do tempo amarrada à locução (frames absolutos, 30 fps).
 * Fala da cliente → cena:
 *   0,0–7,6 s   "Alô Santa Tereza do Oeste, o melhor burger da cidade…"
 *   7,6–15,8 s  "Dá uma olhada nesse combo duplo… por apenas R$ 44,99"
 *   15,8–20,1 s "Prefere bacon ou quer dois smashes artesanais?"
 *   20,1–24,07 s "Temos opções irresistíveis para matar a sua fome"
 *   24,07–30,5 s "Tá esperando o quê? Acesse agora o nosso site…"
 */
export const TIMELINE = {
  hook: { from: 0, duration: 228 },
  promo: { from: 228, duration: 246 },
  combos: { from: 474, duration: 129 },
  more: { from: 603, duration: 119 },
  cta: { from: 722, duration: 193 },
} as const;
export const TOTAL_FRAMES = TIMELINE.cta.from + TIMELINE.cta.duration; // 915 = 30,5 s
