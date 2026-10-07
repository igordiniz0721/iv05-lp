import { staticFile } from "remotion";

/**
 * Aceita o retorno de staticFile(), URLs absolutas ou um caminho relativo a
 * public/ digitado no Studio (ex.: "assets/foto-nova.png").
 */
export const resolveAsset = (src: string): string =>
  /^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src);

/** Separa "44,99" em { int: "44", cents: ",99" } para o estilo de preço do cardápio. */
export const splitPrice = (value: string) => {
  const [int, cents] = value.replace(/^R\$\s*/i, "").split(/[,.]/);
  return { int, cents: cents ? `,${cents}` : "" };
};
