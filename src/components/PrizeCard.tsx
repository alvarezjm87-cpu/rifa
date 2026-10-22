'use client';

import React from 'react';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { Gift, Award, Calendar, CheckCircle2, Heart } from 'lucide-react';
import { JamonIcon } from './JamonIcon';
import { QuesoIcon } from './QuesoIcon';

export const PrizeCard: React.FC = () => {
  return (
    <div className="relative bg-white rounded-3xl shadow-lg border-2 border-amber-200/90 overflow-hidden mb-8 washi-tape">
      {/* Header bar styled like notebook spiral or cute banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-6 py-3.5 text-yellow-950 flex items-center justify-between border-b-2 border-amber-300">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-pink-600 fill-pink-500" />
          <span className="font-display font-bold text-sm sm:text-base tracking-wide">
            {RAFFLE_CONFIG.prize.badge}
          </span>
        </div>
        <span className="text-xs sm:text-sm bg-white/90 text-pink-600 px-3 py-1 rounded-full font-display font-bold shadow-sm">
          {RAFFLE_CONFIG.pricePerNumber}€ por número
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Premio para disfrutar en familia</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="p-2 bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center gap-1">
                <JamonIcon className="w-12 h-12 sm:w-14 sm:h-14" />
                <QuesoIcon className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-gray-900 leading-tight">
                {RAFFLE_CONFIG.prize.title}
              </h2>
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
              {RAFFLE_CONFIG.prize.description}
            </p>

            <div className="bg-sky-50 border-2 border-dashed border-sky-300 rounded-2xl p-3.5 text-xs sm:text-sm text-sky-900 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-display font-bold block text-sky-950">
                  ¿Cómo sabremos quién gana?
                </strong>
                <span>{RAFFLE_CONFIG.draw.rule}</span>
              </div>
            </div>
          </div>

          {/* Student 3-step checklist note */}
          <div className="w-full md:w-80 bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-5 shadow-sm flex-shrink-0 relative">
            <div className="absolute -top-3 right-4 bg-pink-500 text-white text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full shadow-sm sticker-tilt-2">
              ¡Súper fácil!
            </div>

            <h3 className="font-display font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pasos para participar:
            </h3>

            <ol className="space-y-2.5 text-xs text-gray-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-yellow-300 text-yellow-950 font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                  1
                </span>
                <span>
                  <strong>Elige tu número libre</strong> en el tablero verde.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-300 text-sky-950 font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                  2
                </span>
                <span>
                  Escribe tu <strong>nombre y teléfono</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-300 text-emerald-950 font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                  3
                </span>
                <span>
                  Haz el <strong>Bizum de 3€</strong> y pulsa enviar WhatsApp para que quede bloqueado.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
