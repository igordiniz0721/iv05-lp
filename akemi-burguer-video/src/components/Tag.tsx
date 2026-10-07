import React from "react";
import { SPRINGS, useSpringIn, useSpringOut } from "../lib/animation";

const VARIANTS = {
  accent: "bg-accent text-secondary",
  primary: "bg-primary text-white",
  dark: "bg-secondary text-accent",
  cream: "bg-cream text-secondary",
  hot: "bg-hot text-white",
} as const;

/** Selo/etiqueta que "estoura" na tela com spring elástico. */
export const Tag: React.FC<{
  children: React.ReactNode;
  delay: number;
  exitAt?: number;
  variant?: keyof typeof VARIANTS;
  rotate?: number;
  fontSize?: number;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  children,
  delay,
  exitAt,
  variant = "accent",
  rotate = -3,
  fontSize = 40,
  icon,
  className = "",
}) => {
  const enter = useSpringIn(delay, SPRINGS.elastic);
  const exit = useSpringOut(exitAt, 10);
  const scale = enter * (1 - exit);

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full font-body font-extrabold uppercase tracking-wide shadow-[0_10px_0_rgba(0,0,0,0.22)] ${VARIANTS[variant]} ${className}`}
      style={{
        fontSize,
        padding: `${fontSize * 0.32}px ${fontSize * 0.75}px`,
        transform: `scale(${scale}) rotate(${rotate + (1 - enter) * -14}deg)`,
        opacity: Math.min(1, enter * 2) * (1 - exit),
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};
