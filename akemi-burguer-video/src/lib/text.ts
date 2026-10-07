/**
 * Quebra um texto em linhas equilibradas para tipografia cinética.
 * Preposições curtas ("DO", "DA", "DE"...) grudam na palavra seguinte para
 * não sobrarem sozinhas no fim da linha.
 */
export const balanceLines = (text: string, maxChars: number): string[] => {
  const words = text.trim().split(/\s+/);
  const tokens: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.length <= 2 && i < words.length - 1) {
      words[i + 1] = `${w} ${words[i + 1]}`;
      continue;
    }
    tokens.push(w);
  }

  const lines: string[] = [];
  for (const token of tokens) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${token}`.length <= maxChars) {
      lines[lines.length - 1] = `${last} ${token}`;
    } else {
      lines.push(token);
    }
  }
  return lines;
};

/**
 * Tamanho de fonte para que a linha mais longa caiba em `maxWidth`.
 * `charRatio` ≈ largura média de um caractere em "em" (Anton ≈ 0.5).
 */
export const fitFontSize = (
  lines: string[],
  maxWidth: number,
  maxSize: number,
  charRatio = 0.52,
) => {
  const longest = Math.max(...lines.map((l) => l.length));
  return Math.min(maxSize, Math.floor(maxWidth / (longest * charRatio)));
};
