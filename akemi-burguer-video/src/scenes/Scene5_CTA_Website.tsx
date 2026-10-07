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
import { BagIcon, GlobeIcon, HandPointer, LockIcon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { PhoneMockup } from "../components/PhoneMockup";
import { beatPulse, CLAMP, shake, SPRINGS, useSpringIn, useSpringOut, wave } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import { sec, TIMELINE, type AkemiPromoProps } from "../schema";

/*
 * Momentos-chave (frames locais) amarrados à fala:
 * "Tá esperando o quê? Acesse agora o nosso site e faça o seu pedido online."
 */
const at = (s: number) => sec(s) - TIMELINE.cta.from;
const T = {
  question: 0,
  questionHit: at(24.6),
  questionOut: at(25.2),
  logo: at(25.3),
  acesse: at(25.38) - 2,
  site: at(26.36) - 2,
  phone: at(25.5),
  typeStart: at(26.4),
  typeEnd: at(27.3),
  pageLoaded: at(27.3),
  scrollEnd: at(30),
  button: at(27.28) - 2,
  pulseStart: at(27.8),
  handIn: at(27.4),
  tap: at(28.28),
  handOut: at(29),
} as const;

const PHONE = { width: 480, height: 880, top: 672 };
/** Quanto o print do cardápio rola dentro do celular (até a seção "Burguers"). */
const SCROLL_PX = 1250;
const BUTTON_TOP = 1410;
const TAP_POINT = { x: 690, y: 1480 };

type Props = Pick<
  AkemiPromoProps,
  | "siteUrl"
  | "city"
  | "logoSrc"
  | "burgerDoubleSrc"
  | "comboBaconSrc"
  | "comboSmashSrc"
  | "siteScreenshotSrc"
>;

/**
 * Cena 5 — "Tá esperando o quê?" + CTA para o site (24,07–30,5 s).
 * Pergunta em tipografia de impacto; depois os lanches desfocados ao fundo,
 * o celular abrindo o cardápio digital de verdade (print rolando), URL em
 * caixa alta e o botão pulsando que recebe o toque do dedo.
 */
export const Scene5_CTA_Website: React.FC<Props> = (props) => {
  const { siteUrl, city, logoSrc } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = useSpringIn(T.logo, SPRINGS.elastic);
  const line1 = useSpringIn(T.acesse, SPRINGS.punch);
  const line2 = useSpringIn(T.site, SPRINGS.punch);
  const phone = spring({ frame: frame - T.phone, fps, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const caption = useSpringIn(T.tap, SPRINGS.smooth);

  return (
    <AbsoluteFill className="bg-secondary">
      <BlurredFood {...props} />

      <div className="absolute left-0 right-0 top-[56px] flex justify-center">
        <Logo
          src={logoSrc}
          size={220}
          style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -40}deg)` }}
        />
      </div>

      <div className="absolute left-0 right-0 top-[268px] flex flex-col items-center">
        <div
          className="font-display text-[118px] leading-[0.95] text-white"
          style={{ transform: `scale(${interpolate(line1, [0, 1], [2.2, 1])})`, opacity: Math.min(1, line1 * 3) }}
        >
          ACESSE AGORA
        </div>
        <div
          className="font-display text-[170px] leading-[0.95] text-accent"
          style={{
            transform: `scale(${interpolate(line2, [0, 1], [2.2, 1])})`,
            opacity: Math.min(1, line2 * 3),
            textShadow: "0 10px 0 color-mix(in srgb, var(--akemi-primary) 85%, black)",
          }}
        >
          NOSSO SITE
        </div>
      </div>

      <UrlPill url={siteUrl} />

      <div
        className="absolute left-1/2"
        style={{
          top: PHONE.top,
          marginLeft: -PHONE.width / 2,
          transform: `translateY(${(1 - phone) * 1300 + wave(frame, 60) * 10}px) rotate(${interpolate(phone, [0, 1], [12, -2]) + wave(frame, 80) * 0.8}deg)`,
        }}
      >
        <PhoneMockup width={PHONE.width} height={PHONE.height}>
          <RealSite url={siteUrl} screenshotSrc={props.siteScreenshotSrc} />
        </PhoneMockup>
      </div>

      <CtaButton />

      <div
        className="absolute left-0 right-0 top-[1600px] text-center font-body text-[30px] font-semibold uppercase tracking-[0.12em] text-white/80"
        style={{ opacity: caption, transform: `translateY(${(1 - caption) * 30}px)` }}
      >
        Cardápio digital • {city}
      </div>

      <Hand />

      <WaitingQuestion />
    </AbsoluteFill>
  );
};

/** "TÁ ESPERANDO O QUÊ?!" — tela cheia, antes do CTA. */
const WaitingQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = useSpringIn(T.question, SPRINGS.punch);
  const l2 = useSpringIn(T.questionHit - 4, SPRINGS.punch);
  const out = useSpringOut(T.questionOut, 8);
  const cam = shake(frame, T.questionHit - 3, 22, 10);
  if (out >= 0.999) return null;

  return (
    <AbsoluteFill
      className="items-center justify-center bg-primary"
      style={{
        opacity: 1 - out,
        transform: `translate(${cam.x}px, ${cam.y}px) scale(${1 + out * 1.6})`,
        filter: `blur(${out * 14}px)`,
      }}
    >
      <Embers count={20} seed="wait" />
      <div
        className="font-display text-[190px] leading-[0.92] text-white"
        style={{
          transform: `scale(${interpolate(l1, [0, 1], [2.6, 1])}) rotate(-3deg)`,
          opacity: Math.min(1, l1 * 3),
          textShadow: "0 12px 0 var(--akemi-secondary)",
        }}
      >
        TÁ ESPERANDO
      </div>
      <div
        className="mt-4 rounded-[36px] bg-secondary px-14 pb-4 font-heavy text-[190px] leading-[1.05] text-accent"
        style={{
          transform: `scale(${interpolate(l2, [0, 1], [3, 1])}) rotate(3deg)`,
          opacity: Math.min(1, l2 * 3),
          boxShadow: "0 16px 0 rgba(0,0,0,0.3)",
        }}
      >
        O QUÊ?!
      </div>
    </AbsoluteFill>
  );
};

/** Fotos dos lanches ao fundo, desfocadas e escurecidas. */
const BlurredFood: React.FC<Props> = ({ burgerDoubleSrc, comboBaconSrc, comboSmashSrc }) => {
  const frame = useCurrentFrame();
  const appear = useSpringIn(0, SPRINGS.smooth);
  const zoom = 1.1 + frame * 0.0015;
  const photo = "absolute";
  const filter = "blur(22px) brightness(0.5) saturate(1.25)";

  return (
    <AbsoluteFill style={{ opacity: appear, transform: `scale(${zoom})` }}>
      <Img src={resolveAsset(burgerDoubleSrc)} className={photo} style={{ width: 1100, left: -10, top: 380, filter }} />
      <Img src={resolveAsset(comboBaconSrc)} className={photo} style={{ width: 760, left: -260, top: 1180, filter }} />
      <Img src={resolveAsset(comboSmashSrc)} className={photo} style={{ width: 800, right: -300, top: 40, filter }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--akemi-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--akemi-secondary) 35%, transparent) 45%, color-mix(in srgb, var(--akemi-secondary) 92%, transparent) 100%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 900,
          height: 900,
          left: 90,
          top: 760,
          opacity: 0.45,
          background: "radial-gradient(circle, var(--akemi-primary) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** URL em caixa alta com efeito de digitação. */
const UrlPill: React.FC<{ url: string }> = ({ url }) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(14, SPRINGS.snappy);
  const text = url.toUpperCase();
  const chars = Math.round(
    interpolate(frame, [T.typeStart, T.typeEnd], [0, text.length], CLAMP),
  );
  const fontSize = Math.min(44, Math.floor(820 / (text.length * 0.72)));
  const caretOn = frame < T.typeEnd + 12 && Math.floor(frame / 6) % 2 === 0;

  return (
    <div className="absolute left-0 right-0 top-[548px] flex justify-center">
      <div
        className="flex items-center gap-4 rounded-full border-4 border-accent bg-black/35 px-9 py-4 text-accent"
        style={{ transform: `scale(${enter})`, opacity: enter }}
      >
        <GlobeIcon size={fontSize * 1.05} />
        <span
          className="whitespace-nowrap font-body font-extrabold tracking-[0.06em]"
          style={{ fontSize }}
        >
          {text.slice(0, chars)}
          <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
          {/* reserva a largura final para o pill não "crescer" durante a digitação */}
          <span className="invisible">{text.slice(chars)}</span>
        </span>
      </div>
    </div>
  );
};

/** Tela do celular: navegador abrindo o cardápio digital real e rolando. */
const RealSite: React.FC<{ url: string; screenshotSrc: string }> = ({ url, screenshotSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const address = url.toLowerCase();
  const typed = address.slice(
    0,
    Math.round(interpolate(frame, [T.typeStart, T.typeEnd], [0, address.length], CLAMP)),
  );
  const loading = interpolate(frame, [T.typeEnd - 4, T.pageLoaded + 4], [0, 1], CLAMP);
  const page = spring({ frame: frame - T.pageLoaded, fps, config: SPRINGS.smooth });
  // rola do topo até os "Burguers" do cardápio
  const scroll = interpolate(frame, [T.pageLoaded + 10, T.scrollEnd], [0, 1], {
    ...CLAMP,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div className="flex h-full flex-col bg-white font-body text-secondary">
      <div className="flex h-[52px] items-end justify-between px-8 pb-1 text-[19px] font-semibold">
        <span>19:30</span>
        <span className="flex items-center gap-2">
          <span className="flex items-end gap-[3px]">
            {[8, 11, 14, 17].map((h) => (
              <span key={h} className="w-[4px] rounded-sm bg-secondary" style={{ height: h }} />
            ))}
          </span>
          <span className="h-[14px] w-[28px] rounded-[4px] border-2 border-secondary p-[2px]">
            <span className="block h-full w-[70%] rounded-[2px] bg-secondary" />
          </span>
        </span>
      </div>
      <div className="mx-4 mt-2 flex h-[50px] items-center gap-2 rounded-full bg-[#efe9e3] px-5 text-[17px] font-semibold">
        <LockIcon size={16} className="shrink-0 text-[#2f8f46]" />
        <span className="truncate">{typed || "\u00a0"}</span>
      </div>
      <div className="mx-4 mt-2 h-[5px] overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${loading * 100}%`, opacity: loading >= 1 ? 1 - page : 1 }}
        />
      </div>
      <div className="relative mt-1 flex-1 overflow-hidden" style={{ opacity: page }}>
        <Img
          src={resolveAsset(screenshotSrc)}
          className="absolute left-0 top-0 w-full"
          style={{ transform: `translateY(${-scroll * SCROLL_PX}px)` }}
        />
      </div>
    </div>
  );
};

/** Botão de CTA com pulso de escala + anel de brilho, pressionado pelo dedo. */
const CtaButton: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(T.button, SPRINGS.elastic);
  const pulse = frame >= T.pulseStart ? beatPulse(frame - T.pulseStart, 24, 0.07) : 1;
  const press = interpolate(frame, [T.tap - 2, T.tap + 1, T.tap + 8], [0, 1, 0], CLAMP);
  const ringT = frame >= T.pulseStart ? ((frame - T.pulseStart) % 24) / 24 : 0;
  const ripple = interpolate(frame, [T.tap, T.tap + 18], [0, 1], CLAMP);

  return (
    <div className="absolute left-0 right-0 flex justify-center" style={{ top: BUTTON_TOP }}>
      <div
        className="relative"
        style={{ transform: `scale(${enter * pulse * (1 - press * 0.08)})` }}
      >
        {frame >= T.pulseStart ? (
          <div
            className="absolute inset-0 rounded-full border-[6px] border-accent"
            style={{ transform: `scale(${1 + ringT * 0.3}, ${1 + ringT * 0.9})`, opacity: 1 - ringT }}
          />
        ) : null}
        <div
          className="relative flex items-center gap-5 overflow-hidden rounded-full bg-accent px-14 py-6 font-display text-[66px] leading-none text-secondary"
          style={{
            boxShadow:
              "0 14px 0 color-mix(in srgb, var(--akemi-accent) 55%, black), 0 30px 60px rgba(0,0,0,0.5)",
            filter: `brightness(${1 + press * 0.15})`,
          }}
        >
          <BagIcon size={64} />
          FAZER PEDIDO ONLINE
          {/* ondulação do toque */}
          {ripple > 0 && ripple < 1 ? (
            <div
              className="absolute left-[70%] top-1/2 rounded-full bg-white"
              style={{
                width: 60,
                height: 60,
                transform: `translate(-50%, -50%) scale(${ripple * 14})`,
                opacity: (1 - ripple) * 0.55,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Dedo entra, toca o botão e sai. */
const Hand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrive = spring({ frame: frame - T.handIn, fps, config: SPRINGS.smooth, durationInFrames: 18 });
  const leave = spring({ frame: frame - T.handOut, fps, config: SPRINGS.smooth, durationInFrames: 14 });
  const press = interpolate(frame, [T.tap - 3, T.tap, T.tap + 6], [1, 0.84, 1], CLAMP);

  if (frame < T.handIn) return null;

  const size = 170;
  const tip = { x: size * (24 / 64), y: size * (7 / 64) }; // ponta do dedo no SVG
  const x = interpolate(arrive, [0, 1], [1150, TAP_POINT.x]) + leave * 420;
  const y = interpolate(arrive, [0, 1], [2050, TAP_POINT.y]) + leave * 520;

  return (
    <div
      className="absolute"
      style={{
        left: x - tip.x,
        top: y - tip.y,
        transform: `scale(${press}) rotate(${-12 + (1 - arrive) * 20}deg)`,
        transformOrigin: `${tip.x}px ${tip.y}px`,
        filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.45))",
      }}
    >
      <HandPointer size={size} />
    </div>
  );
};
