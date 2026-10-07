import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BagIcon, GlobeIcon, HandPointer, LockIcon, PlusIcon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { PhoneMockup } from "../components/PhoneMockup";
import { Price } from "../components/Price";
import { beatPulse, CLAMP, SPRINGS, useSpringIn, wave } from "../lib/animation";
import { resolveAsset } from "../lib/assets";
import type { AkemiPromoProps } from "../schema";
import { CREAM } from "../theme";

/** Momentos-chave (frames locais da cena). */
const T = {
  phone: 8,
  typeStart: 16,
  typeEnd: 40,
  pageLoaded: 40,
  button: 50,
  pulseStart: 62,
  handIn: 62,
  tap: 82,
  handOut: 100,
} as const;

const PHONE = { width: 480, height: 880, top: 672 };
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
  | "bgTextureSrc"
  | "prices"
>;

/**
 * Cena 4 — CTA direto para o site (frames 330–450).
 * Fundo com os lanches desfocados, celular com o cardápio digital abrindo,
 * URL em caixa alta e botão pulsando que recebe o toque do dedo.
 */
export const Scene4_CTA_Website: React.FC<Props> = (props) => {
  const { siteUrl, city, logoSrc } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = useSpringIn(4, SPRINGS.elastic);
  const line1 = useSpringIn(8, SPRINGS.punch);
  const line2 = useSpringIn(12, SPRINGS.punch);
  const phone = spring({ frame: frame - T.phone, fps, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const caption = useSpringIn(66, SPRINGS.smooth);

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
          PEÇA PELO
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
          <MiniSite {...props} />
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

/** Conteúdo da tela do celular: navegador abrindo o cardápio digital. */
const MiniSite: React.FC<Props> = ({
  siteUrl,
  logoSrc,
  bgTextureSrc,
  burgerDoubleSrc,
  comboBaconSrc,
  comboSmashSrc,
  prices,
}) => {
  const frame = useCurrentFrame();
  const url = siteUrl.toLowerCase();
  const typed = url.slice(
    0,
    Math.round(interpolate(frame, [T.typeStart, T.typeEnd], [0, url.length], CLAMP)),
  );
  const loading = interpolate(frame, [T.typeEnd - 4, T.pageLoaded + 4], [0, 1], CLAMP);
  const page = useSpringIn(T.pageLoaded, SPRINGS.smooth);

  const items = [
    { name: "Combo Duplo", detail: "Duplo + fritas + refri", src: burgerDoubleSrc, price: prices.comboDuplo },
    { name: "Combo Bacon", detail: "160g + fritas + coca lata", src: comboBaconSrc, price: prices.comboBacon },
    { name: "Combo Smash", detail: "2 smash + fritas + coca 600ml", src: comboSmashSrc, price: prices.comboSmash },
  ];

  return (
    <div className="flex h-full flex-col font-body text-secondary">
      {/* status bar */}
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

      {/* barra do navegador */}
      <div className="mx-4 mt-2 flex h-[54px] items-center gap-2 rounded-full bg-[#efe3d6] px-5 text-[19px] font-semibold">
        <LockIcon size={18} className="shrink-0 text-[#2f8f46]" />
        <span className="truncate">{typed || " "}</span>
      </div>
      <div className="mx-4 mt-2 h-[5px] overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${loading * 100}%`, opacity: loading >= 1 ? 1 - page : 1 }}
        />
      </div>

      {/* página */}
      <div
        className="mt-2 flex flex-1 flex-col"
        style={{ opacity: page, transform: `translateY(${(1 - page) * 40}px)` }}
      >
        <div className="relative mx-4 h-[200px] overflow-hidden rounded-[26px] bg-primary">
          <Img src={resolveAsset(bgTextureSrc)} className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="relative flex h-full items-center gap-4 px-5">
            <Img
              src={resolveAsset(logoSrc)}
              className="w-[132px] shrink-0 object-contain"
              style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}
            />
            <div className="flex flex-col items-start">
              <span className="font-display text-[54px] leading-none text-white">AKEMI</span>
              <span className="font-script text-[24px] leading-tight text-accent">smash & burguer</span>
              <span className="mt-2 flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-white">
                <span className="h-[9px] w-[9px] rounded-full bg-[#3ddc6b]" />
                Aberto agora
              </span>
            </div>
          </div>
        </div>

        <div className="mx-5 mb-3 mt-5 text-[19px] font-extrabold uppercase tracking-wide">
          Combos em destaque
        </div>

        {items.map((item, i) => (
          <MenuRow key={item.name} index={i} {...item} />
        ))}
      </div>
    </div>
  );
};

const MenuRow: React.FC<{
  index: number;
  name: string;
  detail: string;
  src: string;
  price: string;
}> = ({ index, name, detail, src, price }) => {
  const enter = useSpringIn(T.pageLoaded + 4 + index * 4, SPRINGS.snappy);
  return (
    <div
      className="mx-4 mb-3 flex h-[112px] items-center gap-3 rounded-[22px] bg-white px-3"
      style={{
        boxShadow: "0 6px 16px rgba(43,17,4,0.12)",
        transform: `translateX(${(1 - enter) * 480}px)`,
      }}
    >
      <div className="flex h-[92px] w-[100px] shrink-0 items-center justify-center rounded-[16px]" style={{ background: CREAM }}>
        <Img src={resolveAsset(src)} className="max-h-[86px] max-w-[94px] object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[21px] font-extrabold leading-tight">{name}</div>
        <div className="truncate text-[14px] font-medium text-secondary/60">{detail}</div>
        <Price value={price} size={34} className="mt-1 text-primary" />
      </div>
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <PlusIcon size={22} />
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
