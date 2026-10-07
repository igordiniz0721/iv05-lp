import React from "react";
import { splitPrice } from "../lib/assets";

/**
 * Preço no estilo do cardápio Akemi: "R$" pequeno, inteiro gigante em Anton
 * e centavos sobrescritos. `size` é a altura do número inteiro em px.
 */
export const Price: React.FC<{
  value: string;
  size: number;
  className?: string;
}> = ({ value, size, className = "" }) => {
  const { int, cents } = splitPrice(value);
  return (
    <div className={`flex items-start font-display leading-none ${className}`}>
      <span style={{ fontSize: size * 0.3, marginTop: size * 0.36, marginRight: size * 0.06 }}>
        R$
      </span>
      <span style={{ fontSize: size, letterSpacing: "-0.01em" }}>{int}</span>
      <span style={{ fontSize: size * 0.34, marginTop: size * 0.08 }}>{cents}</span>
    </div>
  );
};
