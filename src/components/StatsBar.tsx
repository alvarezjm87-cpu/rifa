'use client';

import React from 'react';
import { RaffleStats } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { Sparkles, Clock, Check, Backpack } from 'lucide-react';

interface StatsBarProps {
  stats: RaffleStats;
  currentFilter: 'todos' | 'libres' | 'reservados' | 'pagados';
  onFilterChange: (filter: 'todos' | 'libres' | 'reservados' | 'pagados') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-100 mb-6">
      {/* Progress header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎒</span>
          <span className="font-display font-bold text-gray-800 text-sm sm:text-base">
            Termómetro del Viaje a Fátima
          </span>
          <span className="text-xs bg-pink-100 text-pink-700 font-display font-bold px-2.5 py-0.5 rounded-full border border-pink-200">
            {stats.pagados + stats.reservados} / {stats.total} números
          </span>
        </div>

        <div className="text-xs sm:text-sm font-bold text-gray-600">
          Recaudado para el viaje:{' '}
          <span className="text-emerald-600 font-display font-black text-lg">
            {stats.recaudado.toFixed(2)} {RAFFLE_CONFIG.currency}
          </span>
          <span className="text-gray-400 font-normal"> / {stats.totalObjetivo} {RAFFLE_CONFIG.currency}</span>
        </div>
      </div>

      {/* Thermometer / Progress bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 mb-5 shadow-inner">
        <div className="h-full flex rounded-full overflow-hidden transition-all duration-500">
          {/* Pagados */}
          <div
            style={{ width: `${(stats.pagados / stats.total) * 100}%` }}
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
            title={`${stats.pagados} Pagados`}
          />
          {/* Reservados */}
          <div
            style={{ width: `${(stats.reservados / stats.total) * 100}%` }}
            className="bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-500"
            title={`${stats.reservados} Reservados`}
          />
        </div>
      </div>

      {/* Filter Tabs / Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onFilterChange('todos')}
          className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
            currentFilter === 'todos'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold opacity-80 uppercase tracking-tight">Todos</div>
            <div className="text-xl font-display font-black">{stats.total}</div>
          </div>
          <span className="text-lg">🎯</span>
        </button>

        <button
          onClick={() => onFilterChange('libres')}
          className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
            currentFilter === 'libres'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
              : 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-800'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-tight">Disponibles</div>
            <div className="text-xl font-display font-black">{stats.libres}</div>
          </div>
          <span className="text-lg">✨</span>
        </button>

        <button
          onClick={() => onFilterChange('reservados')}
          className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
            currentFilter === 'reservados'
              ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md font-bold'
              : 'bg-amber-50 hover:bg-amber-100/70 border-amber-200 text-amber-900'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-tight">Reservados</div>
            <div className="text-xl font-display font-black">{stats.reservados}</div>
          </div>
          <span className="text-lg">⏳</span>
        </button>

        <button
          onClick={() => onFilterChange('pagados')}
          className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
            currentFilter === 'pagados'
              ? 'bg-pink-500 border-pink-500 text-white shadow-md'
              : 'bg-pink-50 hover:bg-pink-100/70 border-pink-200 text-pink-900'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-tight">Confirmados</div>
            <div className="text-xl font-display font-black">{stats.pagados}</div>
          </div>
          <span className="text-lg">🎉</span>
        </button>
      </div>
    </div>
  );
};
