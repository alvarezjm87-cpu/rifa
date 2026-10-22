'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { JamonIcon } from './JamonIcon';
import { QuesoIcon } from './QuesoIcon';
import confetti from 'canvas-confetti';

interface WinnerCheckerProps {
  tickets: Ticket[];
}

export const WinnerChecker: React.FC<WinnerCheckerProps> = ({ tickets }) => {
  const [onceNumber, setOnceNumber] = useState('');
  const [winnerInfo, setWinnerInfo] = useState<{
    number: string;
    ticket: Ticket | null;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onceNumber.trim()) return;

    const clean = onceNumber.replace(/\D/g, '');
    if (clean.length < 2) return;

    const lastTwo = clean.slice(-2);
    const numInt = parseInt(lastTwo, 10);
    const found = tickets.find((t) => t.number === numInt) || null;

    setWinnerInfo({
      number: lastTwo,
      ticket: found,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 },
      });
    } catch (e) {}
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-amber-100/70 via-yellow-50 to-orange-100/70 border-2 border-dashed border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 bg-yellow-200 text-yellow-950 px-3 py-1 rounded-full font-display font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>Sorteo con el Cupón de la ONCE</span>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h3 className="text-2xl sm:text-3xl font-black font-display text-gray-900">
              ¿Quién se lleva la paletilla y el queso?
            </h3>
            <div className="flex items-center gap-1">
              <JamonIcon className="w-8 h-8" />
              <QuesoIcon className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg font-medium">
            Introduce el número premiado del cupón de la ONCE para ver al instante a qué compañero o familia le ha tocado el premio.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <input
            type="text"
            maxLength={5}
            value={onceNumber}
            onChange={(e) => setOnceNumber(e.target.value)}
            placeholder="Ej: 74528"
            className="w-full sm:w-40 px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-display font-black text-center text-xl bg-white shadow-xs"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Comprobar Ganador</span>
          </button>
        </form>
      </div>

      {winnerInfo && (
        <div className="mt-6 p-5 bg-white border-2 border-amber-300 rounded-3xl shadow-md animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-16 h-16 rounded-2xl bg-yellow-400 text-yellow-950 font-display font-black text-3xl flex items-center justify-center shadow-md border-2 border-amber-500 sticker-tilt-1">
                {winnerInfo.number}
              </span>

              <div>
                <div className="text-xs text-amber-800 font-display font-bold uppercase tracking-tight">
                  Las 2 últimas cifras del sorteo: Nº {winnerInfo.number}
                </div>
                {winnerInfo.ticket && winnerInfo.ticket.status === 'pagado' ? (
                  <div className="text-lg sm:text-xl font-black font-display text-emerald-600 flex items-center gap-1.5">
                    <span>🎉 ¡Felicidades a {winnerInfo.ticket.buyer_name || 'Comprador'}! ¡Te llevas la paletilla y el queso!</span>
                  </div>
                ) : winnerInfo.ticket && winnerInfo.ticket.status === 'reservado' ? (
                  <div className="text-base font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Número reservado por {winnerInfo.ticket.buyer_name} (pendiente de confirmación)</span>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-gray-500">
                    Este número no fue adquirido (quedó libre).
                  </div>
                )}
              </div>
            </div>

            {winnerInfo.ticket?.buyer_phone && (
              <div className="text-xs text-gray-600 bg-slate-50 px-3.5 py-2 rounded-2xl border-2 border-slate-200 font-medium">
                Teléfono ganador: <strong className="text-gray-900">{winnerInfo.ticket.buyer_phone}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
