import React from "react";
import { Img } from "remotion";
import { resolveAsset } from "../lib/assets";

/**
 * Logo oficial (selo com o "Akemi" saindo pelas laterais). Sem recorte
 * circular: o PNG já tem fundo transparente; `size` é a largura.
 */
export const Logo: React.FC<{
  src: string;
  size: number;
  style?: React.CSSProperties;
  className?: string;
}> = ({ src, size, style, className = "" }) => (
  <div className={className} style={{ width: size, ...style }}>
    <Img
      src={resolveAsset(src)}
      className="block h-auto w-full object-contain"
      style={{ filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.45))" }}
    />
  </div>
);
