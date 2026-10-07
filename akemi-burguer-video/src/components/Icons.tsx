import React from "react";

type IconProps = { size?: number; className?: string };

export const FlameIcon: React.FC<IconProps> = ({ size = 40, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.6 1.8c.4 3.1-1 4.9-2.6 6.6C8.4 10.1 7 11.7 7 14.3 7 17.5 9.3 20 12 20s5-2.3 5-5.4c0-1.6-.6-2.9-1.4-4 .1 1.4-.4 2.5-1.4 3.1.3-3.6-.9-7.6-1.6-11.9ZM12 22.5c-4.4 0-8-3.5-8-8.2 0-3.6 2-5.8 3.7-7.6C9.5 4.9 11 3.3 10.4.5l-.1-.5.5.2c4.6 2 9.2 7.3 9.2 13.7 0 4.9-3.6 8.6-8 8.6Z" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5S14.6 18.7 12 21.5M12 2.5C9.4 5.3 8.1 8.5 8.1 12s1.3 6.7 3.9 9.5" />
  </svg>
);

export const BagIcon: React.FC<IconProps> = ({ size = 40, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 7V6a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 1 .9l1.2 13a1 1 0 0 1-1 1.1H3.6a1 1 0 0 1-1-1.1l1.2-13a1 1 0 0 1 1-.9H7Zm2 0h6V6a3 3 0 0 0-6 0v1Zm-1 3.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm8 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={3.2}
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Mão/dedo apontando (cursor de toque). */
export const HandPointer: React.FC<IconProps> = ({ size = 140, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path
      d="M24.5 6.5c2.6 0 4.6 2 4.6 4.6v15.2l1.2-.2c2.2-.3 4.2 1 4.8 3l.2.6.9-.3c2.3-.6 4.6.6 5.4 2.8l.2.6c2.3-.6 4.7.7 5.4 3l1.8 6.2c1.6 5.5.6 11.4-2.8 16L44.8 61H22.4l-9.6-14.1c-1.4-2-.9-4.8 1.1-6.3 1.8-1.3 4.3-1.1 5.9.4l.1.1V11.1c0-2.6 2-4.6 4.6-4.6Z"
      fill="#fff"
      stroke="#2B1104"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M29.1 26.3v10M35.3 29.1v8.4M41.5 31.9v6.6" stroke="#2B1104" strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);
