import React from "react";
import { useCurrentFrame } from "remotion";
import { SPRINGS, useSpringIn, useSpringOut } from "../lib/animation";

/** Selo circular giratório "100% ARTESANAL • 160G" com texto em arco. */
export const Seal: React.FC<{
  delay: number;
  exitAt?: number;
  size?: number;
  ringText?: string;
  center?: string;
  centerSub?: string;
}> = ({
  delay,
  exitAt,
  size = 300,
  ringText = "100% ARTESANAL • 100% ARTESANAL • ",
  center = "160g",
  centerSub = "blend da casa",
}) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(delay, SPRINGS.elastic);
  const exit = useSpringOut(exitAt, 10);
  const spin = frame * 1.6;

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        transform: `scale(${enter * (1 - exit)}) rotate(${(1 - enter) * -90}deg)`,
      }}
    >
      {/* borda serrilhada estilo carimbo */}
      <svg viewBox="0 0 200 200" className="absolute inset-0" style={{ transform: `rotate(${spin}deg)` }}>
        <polygon
          points={Array.from({ length: 48 }, (_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r = i % 2 === 0 ? 100 : 92;
            return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
          }).join(" ")}
          className="fill-accent"
        />
        <defs>
          <path id="seal-ring" d="M100,100 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
        </defs>
        <circle cx="100" cy="100" r="80" className="fill-secondary" />
        <text className="fill-accent font-display" fontSize="19" letterSpacing="2.4">
          <textPath href="#seal-ring">{ringText}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display leading-none text-white" style={{ fontSize: size * 0.24 }}>
          {center}
        </span>
        <span
          className="font-script leading-none text-accent"
          style={{ fontSize: size * 0.085, marginTop: size * 0.02 }}
        >
          {centerSub}
        </span>
      </div>
    </div>
  );
};
