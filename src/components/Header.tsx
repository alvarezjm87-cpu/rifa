'use client';

import React from 'react';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { Sparkles, Heart, ShieldCheck, Share2, ImageIcon, Bus, Backpack, Award } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdminAuthenticated }) => {
  const handleShare = () => {
    const text = `¡Hola! 👋 Apoya a ${RAFFLE_CONFIG.organizer.name} (${RAFFLE_CONFIG.student.grade}) en su viaje a Fátima con el colegio. Sorteamos una ${RAFFLE_CONFIG.prize.title} por solo ${RAFFLE_CONFIG.pricePerNumber}€. Elige tu número del 00 al 99 aquí:`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    if (navigator.share) {
      navigator.share({
        title: RAFFLE_CONFIG.title,
        text,
        url,
      }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <header className="relative bg-gradient-to-br from-sky-400 via-indigo-500 to-pink-500 text-white shadow-xl pt-6 pb-14 px-4 overflow-hidden">
      {/* Playful background doodles & bubbles */}
      <div className="absolute top-4 left-6 text-2xl opacity-30 select-none animate-bounce">🎒</div>
      <div className="absolute top-12 right-10 text-3xl opacity-30 select-none">🚌</div>
      <div className="absolute bottom-6 left-1/4 text-2xl opacity-20 select-none">✏️</div>
      <div className="absolute top-6 right-1/3 text-2xl opacity-30 select-none">⭐</div>
      <div className="absolute bottom-4 right-8 text-3xl opacity-25 select-none">🎉</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top bar with buttons */}
        <div className="flex items-center justify-between gap-3 mb-6">
          {/* Grade sticker */}
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-yellow-950 px-3.5 py-1.5 rounded-full font-display font-bold text-xs sm:text-sm shadow-md border-2 border-white sticker-tilt-1">
            <Backpack className="w-4 h-4 text-pink-600" />
            <span>Colegio • 1º de la ESO</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/cartel_rifa_whatsapp.jpg"
              download="cartel_rifa_lulu.jpg"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Descargar cartel para estados de WhatsApp"
            >
              <ImageIcon className="w-3.5 h-3.5 text-yellow-200" />
              <span className="hidden xs:inline">Ver Cartel</span>
            </a>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Compartir por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-200" />
              <span>Compartir</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                isAdminAuthenticated
                  ? 'bg-emerald-400 text-emerald-950 border-white'
                  : 'bg-black/20 hover:bg-black/30 border-white/30 text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdminAuthenticated ? 'Admin Activo' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Hero Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-block bg-white/15 backdrop-blur-md px-4 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide border border-white/30 text-sky-100">
            ✨ Rifa Solidaria de Estudiantes
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white drop-shadow-md">
            ¡La Rifa de Lulú! 🎒
          </h1>

          <p className="text-xl sm:text-2xl font-hand font-bold text-yellow-200 drop-shadow">
            &quot;¡Ayúdame a no perderme el viaje a Fátima con mi clase del cole! ❤️&quot;
          </p>

          <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-lg mx-auto bg-black/10 backdrop-blur-sm rounded-2xl p-2.5 border border-white/10">
            {RAFFLE_CONFIG.greeting}
          </p>
        </div>

        {/* 3 cute stickers at bottom of header */}
        <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-xl mx-auto text-center">
          <div className="bg-white/95 rounded-2xl p-2.5 shadow-md border-2 border-yellow-200 text-gray-800 sticker-tilt-1">
            <span className="text-[11px] font-bold text-gray-500 block">Papeletas</span>
            <span className="text-base sm:text-lg font-black font-display text-sky-600">00 al 99</span>
          </div>

          <div className="bg-yellow-300 rounded-2xl p-2.5 shadow-md border-2 border-white text-yellow-950 sticker-tilt-2">
            <span className="text-[11px] font-bold text-yellow-800 block">Cada número</span>
            <span className="text-base sm:text-lg font-black font-display text-pink-600">3,00 €</span>
          </div>

          <div className="bg-white/95 rounded-2xl p-2.5 shadow-md border-2 border-pink-200 text-gray-800 sticker-tilt-3">
            <span className="text-[11px] font-bold text-gray-500 block">Sorteo</span>
            <span className="text-base sm:text-lg font-black font-display text-indigo-600">Cupón ONCE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
