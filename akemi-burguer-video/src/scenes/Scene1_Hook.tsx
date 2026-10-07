import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Embers } from "../components/Embers";
import { Logo } from "../components/Logo";
import { CLAMP, shake, SPRINGS, useSpringIn, useSpringOut, wave } from "../lib/animation";
import { balanceLines, fitFontSize } from "../lib/text";
import { sec, type AkemiPromoProps } from "../schema";
import { HOT_RED } from "../theme";

/*
 * Tempos amarrados à locução ("Alô Santa Tereza do Oeste, o melhor burger
 * da cidade acabou de chegar por aqui."). Frames locais = absolutos aqui.
 */
const LOGO_UP = 34; // logo sobe do centro para o topo antes do "Alô"
const PHRASE1 = sec(1.33); // "Alô"
const CITY_WORDS = [sec(2.18), sec(2.58), sec(3.04)]; // Santa / Tereza / do Oeste
const CUT = sec(3.9); // corte em flash → "o melhor burger"
const BEST = { melhor: 2, burger: sec(4.46) - CUT, cidade: sec(4.88) - CUT, chegou: sec(5.56) - CUT };
const EXIT = 214;
const TEXT_SHADOW =
  "0 10px 0 var(--akemi-secondary), 0 22px 40px rgba(0,0,0,0.35)";

/**
 * Cena 1 — O gancho local (0–7,6 s).
 * Logo com bounce elástico no topo + tipografia cinética em duas frases,
 * separadas por um corte em flash.
 */
export const Scene1_Hook: React.FC<Pick<AkemiPromoProps, "city" | "logoSrc">> = ({
  city,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // logo entra grande no centro (bounce elástico) e sobe para o topo
  const logoIn = spring({ frame, fps, config: SPRINGS.elastic });
  const logoUp = spring({ frame: frame - LOGO_UP, fps, config: SPRINGS.snappy });
  const logoY = interpolate(logoIn, [0, 1], [-420, 0]) + (1 - logoUp) * 560;
  const logoScale = (0.4 + logoIn * 0.6) * (1 + (1 - logoUp) * 0.75);
  const logoRotate = interpolate(logoIn, [0, 1], [-30, 0]) + wave(frame, 36) * 3;

  // tremor de câmera nos impactos de texto (cada palavra forte da fala)
  const hits = [...CITY_WORDS, CUT + 1, CUT + BEST.burger, CUT + BEST.chegou].map((at) =>
    shake(frame, at, 16, 9),
  );
  const camX = hits.reduce((sum, h) => sum + h.x, 0);
  const camY = hits.reduce((sum, h) => sum + h.y, 0);

  // saída em "zoom through" para a cena 2
  const exit = useSpringOut(EXIT, 10);
  const cutFlash = interpolate(frame, [CUT - 3, CUT, CUT + 5], [0, 0.9, 0], CLAMP);

  return (
    <AbsoluteFill>
      <BurgerRows />
      <Embers count={22} seed="hook" />

      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, ${camY}px) scale(${1 + exit * 0.7})`,
          opacity: 1 - exit,
          filter: `blur(${exit * 12}px)`,
        }}
      >
        <div className="absolute left-0 right-0 top-[110px] flex justify-center">
          <Logo
            src={logoSrc}
            size={380}
            style={{ transform: `translateY(${logoY}px) rotate(${logoRotate}deg) scale(${logoScale})` }}
          />
        </div>

        <Sequence from={PHRASE1} durationInFrames={CUT - PHRASE1} layout="none" name="Frase 1 — cidade">
          <CityPhrase city={city} />
        </Sequence>
        <Sequence from={CUT} layout="none" name="Frase 2 — melhor burger">
          <BestBurgerPhrase />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill className="bg-white" style={{ opacity: cutFlash }} />
    </AbsoluteFill>
  );
};

/** "Alô, SANTA TEREZA DO OESTE!" — cada bloco cai com impacto. */
const CityPhrase: React.FC<{ city: string }> = ({ city }) => {
  const lines = balanceLines(`${city.toUpperCase()}!`, 9);
  const fontSize = fitFontSize(lines, 940, 230);
  const kicker = useSpringIn(0, SPRINGS.elastic);

  return (
    <AbsoluteFill className="items-center justify-center pt-[300px]">
      <div
        className="mb-4 font-script text-accent"
        style={{
          fontSize: 110,
          textShadow: "0 6px 0 var(--akemi-secondary)",
          transform: `scale(${kicker}) rotate(-8deg)`,
        }}
      >
        Alô,
      </div>
      {lines.map((line, i) => (
        <SlamLine
          key={line}
          delay={(CITY_WORDS[i] ?? CITY_WORDS[CITY_WORDS.length - 1] + 12 * (i - 2)) - PHRASE1}
          fontSize={fontSize}
        >
          {line}
        </SlamLine>
      ))}
    </AbsoluteFill>
  );
};

/** "O MELHOR BURGER DA CIDADE CHEGOU!" */
const BestBurgerPhrase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chegou = spring({ frame: frame - BEST.chegou, fps, config: SPRINGS.snappy });
  const stamp = spring({ frame: frame - BEST.chegou - 6, fps, config: SPRINGS.elastic });

  return (
    <AbsoluteFill className="items-center justify-center pt-[300px]">
      <SlamLine delay={BEST.melhor} fontSize={170}>
        O MELHOR
      </SlamLine>
      <SlamLine delay={BEST.burger} fontSize={205} from={3.4} className="font-heavy text-accent">
        BURGER
      </SlamLine>
      <SlamLine delay={BEST.cidade} fontSize={150}>
        DA CIDADE
      </SlamLine>
      <div
        className="mt-6 rounded-[28px] bg-secondary px-12 pb-3 pt-1 font-display text-accent"
        style={{
          fontSize: 170,
          lineHeight: 1.05,
          boxShadow: `0 14px 0 ${HOT_RED}, 0 30px 50px rgba(0,0,0,0.35)`,
          transform: `translateX(${(1 - chegou) * 1100}px) rotate(${-4 + (1 - stamp) * 6}deg) scale(${0.9 + stamp * 0.1})`,
        }}
      >
        CHEGOU!
      </div>
    </AbsoluteFill>
  );
};

/** Linha que "cai" na tela: escala grande → 1 com spring de impacto. */
const SlamLine: React.FC<{
  children: string;
  delay: number;
  fontSize: number;
  from?: number;
  className?: string;
}> = ({ children, delay, fontSize, from = 2.6, className = "font-display text-white" }) => {
  const p = useSpringIn(delay, SPRINGS.punch);
  return (
    <div
      className={`whitespace-nowrap text-center uppercase ${className}`}
      style={{
        fontSize,
        lineHeight: 0.98,
        textShadow: TEXT_SHADOW,
        opacity: interpolate(p, [0, 0.25], [0, 1], CLAMP),
        transform: `scale(${interpolate(p, [0, 1], [from, 1])}) rotate(${(1 - p) * -6}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** Fundo do gancho: "BURGER" gigante em faixas correndo em sentidos opostos (como na arte). */
const BurgerRows: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = 6;
  return (
    <AbsoluteFill className="justify-center overflow-hidden" style={{ transform: "rotate(-8deg) scale(1.25)" }}>
      {new Array(rows).fill(true).map((_, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const x = ((frame * 9 * dir) % 1400) - 700 + (i % 2) * 300;
        return (
          <div
            key={i}
            className="whitespace-nowrap font-heavy leading-[0.92] text-transparent"
            style={{
              fontSize: 300,
              transform: `translateX(${x}px)`,
              WebkitTextStroke: "4px color-mix(in srgb, var(--akemi-accent) 45%, transparent)",
              opacity: 0.55,
            }}
          >
            BURGER BURGER BURGER
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
