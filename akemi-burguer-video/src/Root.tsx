import "./index.css";
import "./fonts";

import React from "react";
import { Composition, staticFile } from "remotion";
import { AkemiPromo } from "./Composition";
import { akemiPromoSchema, FPS, TOTAL_FRAMES, type AkemiPromoProps } from "./schema";

export const defaultAkemiProps: AkemiPromoProps = {
  siteUrl: "pedidos.akemiburguer.com.br",
  city: "Santa Tereza do Oeste",
  logoSrc: staticFile("assets/logo-akemi.png"),
  burgerDoubleSrc: staticFile("assets/foto-duplo.png"),
  comboBaconSrc: staticFile("assets/foto-combo-bacon.png"),
  comboSmashSrc: staticFile("assets/foto-combo-smash.png"),
  bgTextureSrc: staticFile("assets/bg-texture.png"),
  primaryColor: "#FF5E00",
  secondaryColor: "#2B1104",
  accentColor: "#FDBA25",
  prices: {
    comboDuplo: "44,99",
    comboBacon: "47,99",
    comboSmash: "59,90",
  },
  withSfx: true,
  musicSrc: "",
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
