// Configuração do Remotion CLI/Studio. Só vale para `npx remotion ...`;
// renderizações via Node.js API precisam repassar o webpackOverride.
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(18);
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
