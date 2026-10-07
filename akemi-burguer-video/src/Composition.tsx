import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BrandBackground } from "./components/BrandBackground";
import { SoundDesign } from "./components/SoundDesign";
import { FlashTransition, IrisTransition, StripeWipe } from "./components/Transitions";
import { Scene1_Hook } from "./scenes/Scene1_Hook";
import { Scene2_PromoHighlight } from "./scenes/Scene2_PromoHighlight";
import { Scene3_GridCombos } from "./scenes/Scene3_GridCombos";
import { Scene4_CTA_Website } from "./scenes/Scene4_CTA_Website";
import { TIMELINE, type AkemiPromoProps } from "./schema";

const { hook, promo, combos, cta } = TIMELINE;

/**
 * Akemi Burguer — vídeo promocional 9:16 (1080x1920, 30 fps, 450 frames).
 *
 *   0–90    Scene1_Hook            gancho local + logo
 *   90–210  Scene2_PromoHighlight  combo duplo R$ 44,99
 *   210–330 Scene3_GridCombos      combo bacon + combo smash
 *   330–450 Scene4_CTA_Website     CTA para o site
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

      <Sequence from={cta.from} durationInFrames={cta.duration} name="Scene4_CTA_Website">
        <Scene4_CTA_Website
          siteUrl={props.siteUrl}
          city={props.city}
          logoSrc={props.logoSrc}
          burgerDoubleSrc={props.burgerDoubleSrc}
          comboBaconSrc={props.comboBaconSrc}
          comboSmashSrc={props.comboSmashSrc}
          bgTextureSrc={props.bgTextureSrc}
          prices={props.prices}
        />
      </Sequence>

      {/* transições sobrepostas: o meio de cada sequência coincide com o corte */}
      <Sequence from={promo.from - 8} durationInFrames={16} name="Transição flash">
        <FlashTransition />
      </Sequence>
      <Sequence from={combos.from - 12} durationInFrames={24} name="Transição faixas">
        <StripeWipe />
      </Sequence>
      <Sequence from={cta.from - 12} durationInFrames={24} name="Transição íris">
        <IrisTransition />
      </Sequence>

      <SoundDesign withSfx={props.withSfx} musicSrc={props.musicSrc} />
    </AbsoluteFill>
  );
};
