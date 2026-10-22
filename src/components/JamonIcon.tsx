import React from 'react';

interface JamonIconProps {
  className?: string;
}

export const JamonIcon: React.FC<JamonIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label="Paletilla de Jamón Ibérico"
    >
      {/* Base de madera del jamonero */}
      <rect x="6" y="52" width="52" height="6" rx="3" fill="#78350F" />
      <rect x="8" y="53" width="48" height="2" rx="1" fill="#92400E" opacity="0.6" />

      {/* Herraje metálico de sujeción (mástil del jamonero) */}
      <path d="M17 52V36H21V52H17Z" fill="#64748B" />
      <rect x="14" y="33" width="10" height="4" rx="2" fill="#475569" />
      <circle cx="19" cy="35" r="1.5" fill="#CBD5E1" />

      {/* Soporte trasero para la base del jamón */}
      <path d="M48 52V44H52V52H48Z" fill="#64748B" />
      <path d="M46 44C46 42.5 54 42.5 54 44H46Z" fill="#475569" />

      {/* Silueta de la Pata de Jamón (Corteza / Piel curada) */}
      <path
        d="M13 29
           C11 28 10 31 12 33
           C14 35 18 36 22 36
           C26 36 30 38 34 40
           C39 42.5 45 44 51 42
           C56 40.5 58 35 56 30
           C54 25 48 23 41 23
           C34 23 27 27 21 28
           C17 29 14 29 13 29Z"
        fill="#9A3412"
      />

      {/* Zona del corte magro (carne roja curada del jamón) */}
      <path
        d="M26 29
           C32 27 40 25 47 25
           C53 25 55 29 53 33
           C51 37 46 39 40 38
           C34 37 29 33 26 29Z"
        fill="#BE123C"
      />

      {/* Veteado blanco de tocino y grasa entreverada */}
      <path
        d="M30 30C35 28 42 27 47 27"
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M34 34C39 33 46 33 49 31"
        stroke="#FEF3C7"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M28 32C33 31 38 30 42 31"
        stroke="#FFFBEB"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Grasa de cobertura exterior dorada */}
      <path
        d="M48 24C53 25 56 29 55 33C56 36 54 39 50 41"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Caña fina */}
      <path
        d="M14 29.5L20 28.5L20 33.5L14 32.5Z"
        fill="#7C2D12"
      />

      {/* Pezuña negra ibérica (Pata Negra) */}
      <path
        d="M10 29
           C8.5 29.5 8 31 9.5 32.5
           L14 33.5
           L14 28.5
           Z"
        fill="#0F172A"
      />

      {/* Brillo de la pezuña */}
      <circle cx="11" cy="30.5" r="1" fill="#475569" />
    </svg>
  );
};
