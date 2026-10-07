import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BrandBackground } from "./components/BrandBackground";
import { SoundDesign } from "./components/SoundDesign";
import { FlashTransition, IrisTransition, StripeWipe } from "./components/Transitions";
import { Scene1_Hook } from "./scenes/Scene1_Hook";
import { Scene2_PromoHighlight } from "./scenes/Scene2_PromoHighlight";
import { Scene3_GridCombos } from "./scenes/Scene3_GridCombos";
import { Scene4_MoreBurgers } from "./scenes/Scene4_MoreBurgers";
import { Scene5_CTA_Website } from "./scenes/Scene5_CTA_Website";
import { TIMELINE, type AkemiPromoProps } from "./schema";

const { hook, promo, combos, more, cta } = TIMELINE;

/**
 * Akemi Burguer — vídeo promocional 9:16 (1080x1920, 30 fps, 915 frames),
 * guiado pela locução da cliente (ver TIMELINE em schema.ts).
 *
 *   0–228    Scene1_Hook            "Alô Santa Tereza do Oeste…" + logo
 *   228–474  Scene2_PromoHighlight  combo duplo R$ 44,99
 *   474–603  Scene3_GridCombos      "Prefere bacon ou dois smashes?"
 *   603–722  Scene4_MoreBurgers     "…temos diversos outros lanches"
 *   722–915  Scene5_CTA_Website     "Tá esperando o quê?" + site
 */
export const AkemiPromo: React.FC<AkemiPromoProps> = (props) => {
  const brandVars = {
    "--akemi-primary": props.primaryColor,
    "--akemi-secondary": props.secondaryColor,
    "--akemi-accent": props.accentColor,
  } as React.CSSProperties;

  return (
    <AbsoluteFill style={brandVars} className="overflow-hidden bg-secondary font-body">
      <Sequence durationInFrames={cta.from} name="Fundo da marca">
        <BrandBackground textureSrc={props.bgTextureSrc} />
      </Sequence>

      <Sequence from={hook.from} durationInFrames={hook.duration} name="Scene1_Hook">
        <Scene1_Hook city={props.city} logoSrc={props.logoSrc} />
      </Sequence>

      <Sequence from={promo.from} durationInFrames={promo.duration} name="Scene2_PromoHighlight">
        <Scene2_PromoHighlight burgerDoubleSrc={props.burgerDoubleSrc} prices={props.prices} />
      </Sequence>

      <Sequence from={combos.from} durationInFrames={combos.duration} name="Scene3_GridCombos">
        <Scene3_GridCombos
          comboBaconSrc={props.comboBaconSrc}
          comboSmashSrc={props.comboSmashSrc}
          prices={props.prices}
        />
      </Sequence>

      <Sequence from={more.from} durationInFrames={more.duration} name="Scene4_MoreBurgers">
        <Scene4_MoreBurgers moreBurgers={props.moreBurgers} />
      </Sequence>

      <Sequence from={cta.from} durationInFrames={cta.duration} name="Scene5_CTA_Website">
        <Scene5_CTA_Website
          siteUrl={props.siteUrl}
          city={props.city}
          logoSrc={props.logoSrc}
          burgerDoubleSrc={props.burgerDoubleSrc}
          comboBaconSrc={props.comboBaconSrc}
          comboSmashSrc={props.comboSmashSrc}
          siteScreenshotSrc={props.siteScreenshotSrc}
        />
      </Sequence>

      {/* transições sobrepostas: o meio de cada sequência coincide com o corte */}
      <Sequence from={promo.from - 8} durationInFrames={16} name="Transição flash">
        <FlashTransition />
      </Sequence>
      <Sequence from={combos.from - 12} durationInFrames={24} name="Transição faixas">
        <StripeWipe />
      </Sequence>
      <Sequence from={more.from - 8} durationInFrames={16} name="Transição flash 2">
        <FlashTransition />
      </Sequence>
      <Sequence from={cta.from - 12} durationInFrames={24} name="Transição íris">
        <IrisTransition />
      </Sequence>

      <SoundDesign
        voiceoverSrc={props.voiceoverSrc}
        musicSrc={props.musicSrc}
        withSfx={props.withSfx}
      />
    </AbsoluteFill>
  );
};
