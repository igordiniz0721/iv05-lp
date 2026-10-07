import "./index.css";
import "./fonts";

import React from "react";
import { Composition, staticFile } from "remotion";
import { AkemiPromo } from "./Composition";
import { akemiPromoSchema, FPS, TOTAL_FRAMES, type AkemiPromoProps } from "./schema";

const menuItem = (name: string, price: string, file: string) => ({
  name,
  price,
  src: staticFile(`assets/menu/${file}.png`),
});

export const defaultAkemiProps: AkemiPromoProps = {
  siteUrl: "hamburgueriaconteiner.saipos.com",
  city: "Santa Tereza do Oeste",
  logoSrc: staticFile("assets/logo-akemi.png"),
  burgerDoubleSrc: staticFile("assets/foto-duplo.png"),
  comboBaconSrc: staticFile("assets/foto-combo-bacon.png"),
  comboSmashSrc: staticFile("assets/foto-combo-smash.png"),
  bgTextureSrc: staticFile("assets/bg-texture.png"),
  siteScreenshotSrc: staticFile("assets/site-cardapio.jpg"),
  primaryColor: "#FF5E00",
  secondaryColor: "#2B1104",
  accentColor: "#FDBA25",
  prices: {
    comboDuplo: "44,99",
    comboBacon: "47,99",
    comboSmash: "59,90",
  },
  // cardápio real (hamburgueriaconteiner.saipos.com)
  moreBurgers: [
    menuItem("Burguer Doritos", "33,00", "burguer-doritos"),
    menuItem("Smash Épico", "29,00", "smash-epico"),
    menuItem("BurguerKiu", "40,00", "burguerkiu"),
    menuItem("Frango Crocante", "37,00", "frango-crocante"),
    menuItem("Smash Duplo", "33,00", "smash-duplo"),
    menuItem("Burguer Bacon", "39,00", "burguer-bacon"),
    menuItem("Classic Burguer", "31,00", "classic-burguer"),
    menuItem("Smash Power", "28,00", "smash-power"),
  ],
  voiceoverSrc: staticFile("audio/locucao-cliente.mp3"),
  musicSrc: staticFile("audio/beat.wav"),
  withSfx: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AkemiPromo"
      component={AkemiPromo}
      schema={akemiPromoSchema}
      defaultProps={defaultAkemiProps}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
