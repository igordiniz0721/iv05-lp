import React from "react";

/** Moldura de smartphone; o conteúdo da tela vem em `children`. */
export const PhoneMockup: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, children, style }) => {
  const bezel = width * 0.034;
  const radius = width * 0.15;

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        borderRadius: radius,
        padding: bezel,
        background: "linear-gradient(145deg, #3a1a08 0%, #140803 45%, #2b1104 100%)",
        boxShadow:
          "0 50px 90px rgba(0,0,0,0.55), inset 0 0 0 3px rgba(255,255,255,0.12), 0 0 0 4px color-mix(in srgb, var(--akemi-accent) 35%, transparent)",
        ...style,
      }}
    >
      {/* botões laterais */}
      <div className="absolute rounded-l-md bg-[#140803]" style={{ left: -8, top: height * 0.2, width: 8, height: height * 0.07 }} />
      <div className="absolute rounded-l-md bg-[#140803]" style={{ left: -8, top: height * 0.29, width: 8, height: height * 0.07 }} />
      <div className="absolute rounded-r-md bg-[#140803]" style={{ right: -8, top: height * 0.24, width: 8, height: height * 0.11 }} />

      <div
        className="relative h-full w-full overflow-hidden bg-[#fff8f0]"
        style={{ borderRadius: radius - bezel }}
      >
        {children}
        {/* dynamic island */}
        <div
          className="absolute left-1/2 rounded-full bg-black"
          style={{ top: height * 0.014, width: width * 0.3, height: height * 0.032, transform: "translateX(-50%)" }}
        />
        {/* reflexo de vidro */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)",
          }}
        />
      </div>
    </div>
  );
};
