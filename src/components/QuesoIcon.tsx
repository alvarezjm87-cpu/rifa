import React from 'react';

interface QuesoIconProps {
  className?: string;
}

export const QuesoIcon: React.FC<QuesoIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label="Cuña de Queso Curado"
    >
      {/* Cara lateral del queso */}
      <path
        d="M10 44L44 49L54 36L10 32V44Z"
        fill="#D97706"
      />
      
      {/* Cara superior triangular */}
      <path
        d="M10 32L36 16L54 36L44 49L10 32Z"
        fill="#FBBF24"
      />

      {/* Corteza exterior trasera */}
      <path
        d="M36 16C44 20 50 27 54 36L54 46C50 37 44 30 36 26V16Z"
        fill="#B45309"
      />

      {/* Cara frontal */}
      <path
        d="M10 32L44 49V52L10 44V32Z"
        fill="#F59E0B"
      />

      {/* Ojos / agujeros del queso */}
      <circle cx="28" cy="30" r="3" fill="#D97706" />
      <circle cx="38" cy="36" r="3.5" fill="#D97706" />
      <circle cx="20" cy="37" r="2.2" fill="#D97706" />
      <circle cx="44" cy="27" r="2" fill="#D97706" />
      <circle cx="27" cy="42" r="1.8" fill="#B45309" />
    </svg>
  );
};
