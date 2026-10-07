import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Embers } from "../components/Embers";
import { FlameIcon, PlusIcon } from "../components/Icons";
import { Price } from "../components/Price";
import { Tag } from "../components/Tag";
import { beatPunch, CLAMP, SPRINGS, useSpringIn, useSpringOut, wave } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { sec, TIMELINE, type AkemiPromoProps } from "../schema";
import { HOT_RED } from "../theme";

/*
 * Tempos (frames locais) amarrados à fala: "Dá uma olhada nesse combo duplo,
 * super suculento, com batata crocante e refri por apenas R$ 44,99."
 */
const at = (s: number) => sec(s) - TIMELINE.promo.from;
const T = {
  jump: at(7.78) - 3,
  kicker: at(8.3),
  hamburguer: at(8.74) - 6,
  duplo: at(9.2) - 2,
  suculento: at(10.26) - 2,
  batata: at(11.22) - 3,
  refri: at(12.58) - 3,
  priceSlide: at(13.1) - 3,
  priceHit: at(13.9),
};
const EXIT = TIMELINE.promo.duration - 12;
const BURGER_WIDTH = 900;

/**
 * Cena 2 — Destaque especial: combo duplo (frames 90–210).
 * O hambúrguer salta para o centro e flutua; preço entra em slide lateral e
 * os itens inclusos estouram em seguida.
 */
export const Scene2_PromoHighlight: React.FC<
  Pick<AkemiPromoProps, "burgerDoubleSrc" | "prices">
> = ({ burgerDoubleSrc, prices }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const src = resolveAsset(burgerDoubleSrc);

  // salto para o centro + flutuação contínua (translateY e rotação sutis)
  const jump = spring({ frame: frame - T.jump, fps, config: { damping: 11, stiffness: 120, mass: 0.9 } });
  const floatY = wave(frame, 46) * 20 * jump;
  const floatRotate = wave(frame, 70, 10) * 2.4 * jump;
  const burgerY = interpolate(jump, [0, 1], [1100, 0]) + floatY;
  const burgerRotate = interpolate(jump, [0, 1], [-28, 0]) + floatRotate;
  // "soco" de zoom no "suculento" e empurrão lento de câmera na cena toda
  const burgerScale = interpolate(jump, [0, 1], [0.45, 1]) + beatPunch(frame, [T.suculento], 0.9);
  const push = 1 + frame * 0.00028;

  const exit = useSpringOut(EXIT, 12);
  const glint = interpolate(frame, [T.suculento - 4, T.suculento + 20], [-1, 1.4], CLAMP);

  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <SunRays />
      <Smoke />
      <Embers count={14} seed="promo" opacity={0.8} />

      {/* hambúrguer duplo */}
      <div
        className="absolute left-1/2 top-[600px]"
        style={{
          width: BURGER_WIDTH,
          marginLeft: -BURGER_WIDTH / 2,
          transform: `translateY(${burgerY - exit * 120}px) rotate(${burgerRotate}deg) scale(${burgerScale + exit * 0.5})`,
          opacity: 1 - exit,
        }}
      >
        {/* sombra no "chão" acompanha a flutuação */}
        <div
          className="absolute left-1/2 rounded-[50%] bg-black/40 blur-2xl"
          style={{
            bottom: -30,
            width: 700 - floatY * 4,
            height: 90,
            transform: "translateX(-50%)",
          }}
        />
        <Img
          src={src}
          className="relative w-full"
          style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.45))" }}
        />
        {/* brilho passando pelo pão, recortado pelo próprio PNG */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url("${src}")`,
            WebkitMaskSize: "100% 100%",
            maskImage: `url("${src}")`,
            maskSize: "100% 100%",
            background: `linear-gradient(105deg, transparent ${30 + glint * 40}%, rgba(255,255,255,0.55) ${40 + glint * 40}%, transparent ${50 + glint * 40}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>

      <Title exitProgress={exit} />
      <PriceBadge value={prices.comboDuplo} exitProgress={exit} />

      <div
        className="absolute left-0 right-0 top-[1505px] flex justify-center gap-6"
        style={{ transform: `translateX(${exit * 1200}px)` }}
      >
        <Tag delay={T.batata} variant="accent" fontSize={44} rotate={-2} icon={<PlusIcon size={38} />}>
          Batata Frita Crocante
        </Tag>
        <Tag delay={T.refri} variant="cream" fontSize={44} rotate={3} icon={<PlusIcon size={38} />}>
          Refri
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ exitProgress: number }> = ({ exitProgress }) => {
  const kicker = useSpringIn(T.kicker, SPRINGS.elastic);
  const line1 = useSpringIn(T.hamburguer, SPRINGS.snappy);
  const line2 = useSpringIn(T.duplo, SPRINGS.snappy);
  const script = useSpringIn(T.suculento, SPRINGS.elastic);

  return (
    <div
      className="absolute left-0 right-0 top-[120px] flex flex-col items-center"
      style={{ transform: `translateY(${-exitProgress * 700}px)` }}
    >
      <div
        className="mb-4 flex items-center gap-3 rounded-full px-9 py-3 font-body text-[38px] font-extrabold uppercase tracking-wider text-white"
        style={{
          background: HOT_RED,
          transform: `scale(${kicker}) rotate(-2deg)`,
          boxShadow: "0 8px 0 rgba(0,0,0,0.25)",
        }}
      >
        <FlameIcon size={40} className="text-accent" />
        Combo do dia
      </div>
      <div
        className="font-display text-[164px] leading-[0.95] text-white"
        style={{
          textShadow: "0 10px 0 var(--akemi-secondary)",
          transform: `translateY(${(1 - line1) * -160}px)`,
          opacity: line1,
        }}
      >
        HAMBÚRGUER
      </div>
      <div className="relative">
        <div
          className="font-display text-[164px] leading-[0.95] text-accent"
          style={{
            textShadow: "0 10px 0 var(--akemi-secondary)",
            transform: `translateX(${(1 - line2) * -900}px)`,
          }}
        >
          DUPLO
        </div>
        <div
          className="absolute left-[78%] top-[46%] whitespace-nowrap font-script text-[86px] text-white"
          style={{
            textShadow: "0 6px 0 var(--akemi-secondary)",
            transform: `rotate(-9deg) scale(${script})`,
            transformOrigin: "left center",
          }}
        >
          suculento
        </div>
      </div>
    </div>
  );
};

/** Etiqueta de preço marrom + vermelha entrando em slide lateral. */
const PriceBadge: React.FC<{ value: string; exitProgress: number }> = ({
  value,
  exitProgress,
}) => {
  const frame = useCurrentFrame();
  const slide = useSpringIn(T.priceSlide, SPRINGS.snappy);
  const settle = useSpringIn(T.priceSlide + 6, SPRINGS.elastic);
  const hit = 1 + beatPunch(frame, [T.priceHit, T.priceHit + 12], 1.2);
  const x = interpolate(slide, [0, 1], [-1150, 0]) - exitProgress * 1200;

  return (
    <div
      className="absolute left-[70px] top-[1170px]"
      style={{ transform: `translateX(${x}px) rotate(${-4 + (1 - settle) * -8}deg)` }}
    >
      <div
        className="absolute inset-0 translate-x-[18px] translate-y-[18px] rounded-[36px]"
        style={{ background: HOT_RED }}
      />
      <div className="relative flex items-center gap-8 rounded-[36px] bg-secondary py-5 pl-10 pr-12">
        <div className="font-body text-[36px] font-extrabold uppercase leading-[1.1] text-accent">
          Combo
          <br />
          completo
          <br />
          <span className="text-white">por</span>
        </div>
        <div style={{ transform: `scale(${hit})`, transformOrigin: "left center" }}>
          <Price value={value} size={210} className="text-white" />
        </div>
      </div>
    </div>
  );
};

/** Raios de luz girando atrás do lanche ("brilho no fundo"). */
const SunRays: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = useSpringIn(0, SPRINGS.smooth);
  return (
    <AbsoluteFill className="items-center justify-center">
      <div
        className="absolute rounded-full"
        style={{
          width: 2600,
          height: 2600,
          top: 950 - 1300,
          opacity: 0.35 * appear,
          transform: `rotate(${frame * 0.6}deg) scale(${appear})`,
          background:
            "repeating-conic-gradient(from 0deg, color-mix(in srgb, var(--akemi-accent) 70%, transparent) 0deg 7deg, transparent 7deg 18deg)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 900,
          height: 900,
          top: 950 - 450,
          opacity: 0.55 * appear,
          background: "radial-gradient(circle, #fff3c4 0%, var(--akemi-accent) 35%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Fumaça quente subindo — manchas desfocadas e determinísticas. */
const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill className="pointer-events-none">
      {new Array(6).fill(true).map((_, i) => {
        const r = (k: string) => random(`smoke-${i}-${k}`);
        const life = 90 + r("life") * 40;
        const t = ((frame + r("offset") * life) % life) / life;
        const x = 260 + r("x") * 560 + Math.sin(frame / 20 + i) * 40;
        const y = 1050 - t * 650;
        const size = 220 + t * 260;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white blur-3xl"
            style={{
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              opacity: Math.sin(t * Math.PI) * 0.22,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
