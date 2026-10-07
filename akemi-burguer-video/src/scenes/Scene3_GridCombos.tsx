import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { Price } from "../components/Price";
import { Seal } from "../components/Seal";
import { Tag } from "../components/Tag";
import { beatPunch, SPRINGS, useSpringIn, useSpringOut } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import type { AkemiPromoProps } from "../schema";
import { CREAM } from "../theme";

const EXIT = 106;
/** Batidas (frames locais) em que o foco alterna entre os combos. */
const BEATS_BACON = [45, 75];
const BEATS_SMASH = [60, 90];

/**
 * Cena 3 — Variedade & sabor artesanal (frames 210–330).
 * Tela dividida: Combo Bacon entra pela direita, Combo Smash pela esquerda,
 * e os "socos" de escala alternam entre os dois no ritmo das batidas.
 */
export const Scene3_GridCombos: React.FC<
  Pick<AkemiPromoProps, "comboBaconSrc" | "comboSmashSrc" | "prices">
> = ({ comboBaconSrc, comboSmashSrc, prices }) => {
  const exit = useSpringOut(EXIT, 12);

  return (
    <AbsoluteFill>
      <Header exitProgress={exit} />

      <ComboCard
        top={400}
        side="right"
        delay={0}
        exitProgress={exit}
        beats={BEATS_BACON}
        imageSrc={comboBaconSrc}
        kicker="COMBO"
        name="BACON"
        detail="+ fritas + coca lata"
        price={prices.comboBacon}
        tags={[
          { label: "Bacon crocante", variant: "primary" },
          { label: "Cheddar cremoso", variant: "accent" },
        ]}
      />
      <ComboCard
        top={990}
        side="left"
        delay={15}
        exitProgress={exit}
        beats={BEATS_SMASH}
        imageSrc={comboSmashSrc}
        kicker="COMBO"
        name="SMASH"
        detail="2 smash + fritas + coca 600ml"
        price={prices.comboSmash}
        tags={[
          { label: "Smash burgers", variant: "accent" },
          { label: "100% artesanal", variant: "primary" },
        ]}
      />

      <Marquee exitProgress={exit} />
    </AbsoluteFill>
  );
};

const Header: React.FC<{ exitProgress: number }> = ({ exitProgress }) => {
  const script = useSpringIn(2, SPRINGS.elastic);
  const line1 = useSpringIn(4, SPRINGS.snappy);
  const line2 = useSpringIn(8, SPRINGS.snappy);

  return (
    <div style={{ transform: `translateY(${-exitProgress * 500}px)` }}>
      <div className="absolute left-[60px] top-[100px]">
        <div
          className="font-script text-[64px] leading-none text-accent"
          style={{ transform: `scale(${script}) rotate(-6deg)`, transformOrigin: "left center", textShadow: "0 5px 0 var(--akemi-secondary)" }}
        >
          variedade & sabor
        </div>
        <div
          className="mt-3 font-display text-[112px] leading-[0.95] text-white"
          style={{ transform: `translateX(${(1 - line1) * -900}px)`, textShadow: "0 9px 0 var(--akemi-secondary)" }}
        >
          ESCOLHA SEU
        </div>
        <div
          className="font-display text-[112px] leading-[0.95] text-accent"
          style={{ transform: `translateX(${(1 - line2) * -900}px)`, textShadow: "0 9px 0 var(--akemi-secondary)" }}
        >
          COMBO
        </div>
      </div>
      <div className="absolute right-[50px] top-[95px]">
        <Seal delay={10} size={270} ringText="100% ARTESANAL • 160G • 100% ARTESANAL • 160G • " />
      </div>
    </div>
  );
};

type TagSpec = { label: string; variant: "primary" | "accent" };

const ComboCard: React.FC<{
  top: number;
  side: "left" | "right";
  delay: number;
  exitProgress: number;
  beats: number[];
  imageSrc: string;
  kicker: string;
  name: string;
  detail: string;
  price: string;
  tags: TagSpec[];
}> = ({ top, side, delay, exitProgress, beats, imageSrc, kicker, name, detail, price, tags }) => {
  const frame = useCurrentFrame();
  const slide = useSpringIn(delay, SPRINGS.snappy);
  const image = useSpringIn(delay + 5, { damping: 10, stiffness: 160, mass: 0.7 });
  const title = useSpringIn(delay + 6, SPRINGS.punch);
  const pricePop = useSpringIn(delay + 20, SPRINGS.elastic);
  const punch = beatPunch(frame, beats, 0.09);

  const fromRight = side === "right";
  const dir = fromRight ? 1 : -1;
  const light = fromRight; // cartão claro (bacon) x escuro (smash)
  const x = (1 - slide) * 1200 * dir + exitProgress * 1300 * dir;

  return (
    <div
      className="absolute left-[50px] right-[50px] h-[550px] rounded-[56px]"
      style={{
        top,
        transform: `translateX(${x}px) rotate(${(1 - slide) * 6 * dir}deg) scale(${1 + punch * 0.25})`,
        background: light ? CREAM : "var(--akemi-secondary)",
        boxShadow: `0 24px 0 rgba(0,0,0,0.18), 0 40px 70px rgba(0,0,0,0.3)${
          punch > 0.01 ? `, 0 0 0 ${punch * 120}px color-mix(in srgb, var(--akemi-accent) 70%, transparent)` : ""
        }`,
      }}
    >
      <Img
        src={resolveAsset(imageSrc)}
        className="absolute"
        style={{
          width: fromRight ? 600 : 540,
          top: fromRight ? 30 : 50,
          [fromRight ? "right" : "left"]: fromRight ? -24 : -36,
          transform: `scale(${(0.5 + image * 0.5) * (1 + punch)}) rotate(${(1 - image) * 14 * dir + punch * 30 * -dir}deg)`,
          filter: "drop-shadow(0 26px 26px rgba(0,0,0,0.4))",
        }}
      />

      <div
        className="absolute bottom-0 top-0 flex w-[400px] flex-col items-start justify-center"
        style={{ [fromRight ? "left" : "right"]: 56 }}
      >
        <div style={{ transform: `translateY(${(1 - title) * 60}px)`, opacity: title }}>
          <div className="font-display text-[64px] leading-none text-primary">{kicker}</div>
          <div
            className={`font-display text-[136px] leading-[0.9] ${light ? "text-secondary" : "text-white"}`}
          >
            {name}
          </div>
          <div className={`mt-2 font-body text-[28px] font-bold leading-tight ${light ? "text-secondary/75" : "text-white/80"}`}>
            {detail}
          </div>
        </div>
        <div className="mt-6 flex flex-col items-start gap-3">
          {tags.map((tag, i) => (
            <Tag key={tag.label} delay={delay + 12 + i * 4} variant={tag.variant} fontSize={30} rotate={i % 2 ? 2 : -2}>
              {tag.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* adesivo de preço no canto da foto */}
      <div
        className={`absolute bottom-[26px] rounded-[30px] px-7 pb-2 pt-1 ${light ? "bg-secondary text-accent" : "bg-primary text-white"}`}
        style={{
          [fromRight ? "right" : "left"]: 30,
          transform: `scale(${pricePop * (1 + punch * 1.5)}) rotate(${-6 * dir}deg)`,
          boxShadow: "0 10px 0 rgba(0,0,0,0.25)",
        }}
      >
        <Price value={price} size={104} />
      </div>
    </div>
  );
};

/** Faixa marrom com os destaques do roteiro correndo em loop. */
const Marquee: React.FC<{ exitProgress: number }> = ({ exitProgress }) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(20, SPRINGS.snappy);
  const text = "100% ARTESANAL (160G) • SMASH BURGERS • BACON CROCANTE • CHEDDAR CREMOSO • ";
  const x = -((frame * 7) % 1800);

  return (
    <div
      className="absolute left-[-60px] right-[-60px] top-[1600px] overflow-hidden bg-secondary py-4"
      style={{
        transform: `rotate(-3deg) translateY(${(1 - enter) * 400 + exitProgress * 400}px)`,
        boxShadow: "0 -6px 0 var(--akemi-accent), 0 6px 0 var(--akemi-accent)",
      }}
    >
      <div
        className="whitespace-nowrap font-display text-[58px] leading-none tracking-wide text-accent"
        style={{ transform: `translateX(${x}px)` }}
      >
        {text.repeat(4)}
      </div>
    </div>
  );
};
