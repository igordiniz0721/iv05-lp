import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/*
 * Fontes empacotadas em public/fonts/ (Google Fonts, licença OFL) para a
 * renderização não depender de rede. loadFont() segura o render
 * (delayRender) até cada arquivo carregar. As famílias batem com o @theme
 * de index.css.
 */
const FONTS = [
  { family: "Anton", file: "Anton-400.woff2", weight: "400" },
  { family: "Bowlby One", file: "BowlbyOne-400.woff2", weight: "400" },
  { family: "Pacifico", file: "Pacifico-400.woff2", weight: "400" },
  { family: "Poppins", file: "Poppins-500.woff2", weight: "500" },
  { family: "Poppins", file: "Poppins-600.woff2", weight: "600" },
  { family: "Poppins", file: "Poppins-700.woff2", weight: "700" },
  { family: "Poppins", file: "Poppins-800.woff2", weight: "800" },
];

for (const font of FONTS) {
  loadFont({
    family: font.family,
    url: staticFile(`fonts/${font.file}`),
    weight: font.weight,
    format: "woff2",
  });
}
