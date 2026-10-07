import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Embers } from "../components/Embers";
import { Price } from "../components/Price";
import { beatPunch, CLAMP, SPRINGS, useSpringIn, useSpringOut, wave } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { sec, TIMELINE, type AkemiPromoProps } from "../schema";
import { HOT_RED } from "../theme";

/* Fala: "Temos opções irresistíveis para matar a sua fome." */
const at = (s: number) => sec(s) - TIMELINE.more.from;
const T = {
  temos: at(20.26) - 4,
  outros: at(20.56) - 2,
  irresistiveis: at(21.16) - 2,
  carouselStart: at(20.56),
  matar: at(22.36) - 2,
};
const SLOT = 10; // frames por lanche no carrossel (corte no ritmo)
const EXIT = TIMELINE.more.duration - 12;
const STAGE_TOP = 520;

type Burger = AkemiPromoProps["moreBurgers"][number];

/**
 * Cena 4 — "E fora esses, temos diversos outros lanches deliciosos" (20,1–24,1 s).
 * Carrossel rápido com os lanches reais do cardápio, faixa de miniaturas
 * e "PARA MATAR SUA FOME!" batendo junto com a fala.
 */
export const Scene4_MoreBurgers: React.FC<Pick<AkemiPromoProps, "moreBurgers">> = ({
  moreBurgers,
}) => {
  const frame = useCurrentFrame();
  const exit = useSpringOut(EXIT, 12);
  const active = Math.max(
    0,
    Math.min(moreBurgers.length - 1, Math.floor((frame - T.carouselStart) / SLOT)),
  );

  return (
    <AbsoluteFill>
      <Rays />
      <Embers count={16} seed="more" opacity={0.7} />

      <Header exitProgress={exit} />

      <div style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.4})` }}>
        {moreBurgers.map((burger, i) => (
          <CarouselItem
            key={burger.name}
            burger={burger}
            start={T.carouselStart + i * SLOT}
            isLast={i === moreBurgers.length - 1}
          />
        ))}
      </div>

      <Thumbnails burgers={moreBurgers} active={active} exitProgress={exit} />
      <HungerBanner exitProgress={exit} />
    </AbsoluteFill>
  );
};

const Header: React.FC<{ exitProgress: number }> = ({ exitProgress }) => {
  const script = useSpringIn(0, SPRINGS.elastic);
  const line1 = useSpringIn(T.temos, SPRINGS.punch);
  const line2 = useSpringIn(T.outros, SPRINGS.punch);
  const tasty = useSpringIn(T.irresistiveis, SPRINGS.elastic);
  const slam = (p: number) => ({
    transform: `scale(${2.2 - p * 1.2})`,
    opacity: Math.min(1, p * 3),
  });

  return (
    <div
      className="absolute left-0 right-0 top-[96px] flex flex-col items-center"
      style={{ transform: `translateY(${-exitProgress * 600}px)` }}
    >
      <div
        className="font-script text-[70px] leading-none text-accent"
        style={{
          transform: `scale(${script}) rotate(-5deg)`,
          textShadow: "0 5px 0 var(--akemi-secondary)",
        }}
      >
        e fora esses, temos…
      </div>
      <div
        className="mt-3 font-display text-[118px] leading-[0.95] text-white"
        style={{ ...slam(line1), textShadow: "0 9px 0 var(--akemi-secondary)" }}
      >
        DIVERSOS OUTROS
      </div>
      <div className="relative">
        <div
          className="font-display text-[118px] leading-[0.95] text-accent"
          style={{ ...slam(line2), textShadow: "0 9px 0 var(--akemi-secondary)" }}
        >
          LANCHES
        </div>
        <div
          className="absolute left-[92%] top-[38%] whitespace-nowrap font-script text-[74px] text-white"
          style={{
            transform: `rotate(-8deg) scale(${tasty})`,
            transformOrigin: "left center",
            textShadow: "0 6px 0 var(--akemi-secondary)",
          }}
        >
          deliciosos!
        </div>
      </div>
    </div>
  );
};

/** Um lanche do carrossel: entra pela direita, segura e sai pela esquerda. */
const CarouselItem: React.FC<{ burger: Burger; start: number; isLast: boolean }> = ({
  burger,
  start,
  isLast,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start - 2 || (!isLast && frame > start + SLOT + 10)) return null;

  const enter = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 260, mass: 0.6 } });
  const leave = isLast
    ? 0
    : spring({ frame: frame - start - SLOT, fps, config: { damping: 200 }, durationInFrames: 8 });
  const x = (1 - enter) * 1100 - leave * 1100;
  const rotate = (1 - enter) * 22 - leave * 22 + wave(frame, 40) * 1.5;
  const scale = 0.6 + enter * 0.4 + beatPunch(frame, [start + 2], 0.6);

  return (
    <div
      className="absolute left-0 right-0 flex flex-col items-center"
      style={{ top: STAGE_TOP, transform: `translateX(${x}px)` }}
    >
      <div
        className="flex h-[640px] w-[860px] items-end justify-center"
        style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
      >
        <Img
          src={resolveAsset(burger.src)}
          className="max-h-full max-w-full object-contain"
          style={{ filter: "drop-shadow(0 36px 36px rgba(0,0,0,0.5))" }}
        />
      </div>
      <div className="mt-6 flex items-center gap-5">
        <span
          className="font-display text-[78px] leading-none text-white"
          style={{ textShadow: "0 7px 0 var(--akemi-secondary)" }}
        >
          {burger.name.toUpperCase()}
        </span>
        <span className="rounded-[22px] bg-accent px-5 pb-1 pt-0 text-secondary" style={{ transform: "rotate(-4deg)" }}>
          <Price value={burger.price} size={62} />
        </span>
      </div>
    </div>
  );
};

/** Fila de miniaturas do cardápio; a do lanche em destaque cresce. */
const Thumbnails: React.FC<{ burgers: Burger[]; active: number; exitProgress: number }> = ({
  burgers,
  active,
  exitProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = 104;

  return (
    <div
      className="absolute left-0 right-0 top-[1418px] flex justify-center gap-[12px]"
      style={{ transform: `translateY(${exitProgress * 500}px)` }}
    >
      {burgers.map((burger, i) => {
        const pop = spring({ frame: frame - T.carouselStart - i * 2, fps, config: SPRINGS.elastic });
        const isActive = i === active;
        return (
          <div
            key={burger.name}
            className="flex items-center justify-center rounded-full bg-cream"
            style={{
              width: size,
              height: size,
              transform: `scale(${pop * (isActive ? 1.22 : 0.92)})`,
              boxShadow: isActive
                ? "0 0 0 6px var(--akemi-accent), 0 10px 20px rgba(0,0,0,0.35)"
                : "0 6px 12px rgba(0,0,0,0.25)",
              opacity: isActive ? 1 : 0.75,
            }}
          >
            <Img src={resolveAsset(burger.src)} className="h-[78%] w-[78%] object-contain" />
          </div>
        );
      })}
    </div>
  );
};

/** "PARA MATAR SUA FOME!" batendo junto com a fala. */
const HungerBanner: React.FC<{ exitProgress: number }> = ({ exitProgress }) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(T.matar, SPRINGS.snappy);
  const punch = beatPunch(frame, [T.matar + 2, at(23.44)], 0.5);

  return (
    <div
      className="absolute left-[-40px] right-[-40px] top-[1580px] flex justify-center py-4"
      style={{
        background: HOT_RED,
        transform: `rotate(-4deg) translateX(${(1 - enter) * -1300 + exitProgress * 1300}px) scale(${1 + punch * 0.3})`,
        boxShadow: "0 -8px 0 var(--akemi-accent), 0 8px 0 var(--akemi-accent), 0 30px 50px rgba(0,0,0,0.35)",
      }}
    >
      <span className="font-display text-[96px] leading-none text-white">
        PARA MATAR SUA <span className="text-accent">FOME!</span>
      </span>
    </div>
  );
};

/** Raios girando atrás do carrossel. */
const Rays: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 10], [0, 1], CLAMP);
  return (
    <AbsoluteFill className="items-center">
      <div
        className="absolute rounded-full"
        style={{
          width: 2400,
          height: 2400,
          top: STAGE_TOP + 330 - 1200,
          opacity: 0.32 * appear,
          transform: `rotate(${frame * -0.9}deg)`,
          background:
            "repeating-conic-gradient(from 0deg, color-mix(in srgb, var(--akemi-accent) 70%, transparent) 0deg 8deg, transparent 8deg 20deg)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};
