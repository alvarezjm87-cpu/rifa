'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types/raffle';
import { Clock, Check, Search, Sparkles } from 'lucide-react';

interface RaffleGridProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  isAdmin: boolean;
  onAdminAction?: (ticket: Ticket) => void;
  filter: 'todos' | 'libres' | 'reservados' | 'pagados';
}

export const RaffleGrid: React.FC<RaffleGridProps> = ({
  tickets,
  onSelectTicket,
  isAdmin,
  onAdminAction,
  filter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'libres' && t.status !== 'libre') return false;
    if (filter === 'reservados' && t.status !== 'reservado') return false;
    if (filter === 'pagados' && t.status !== 'pagado') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().padStart(2, '0');
      return t.formattedNumber.includes(searchQuery.trim()) || t.formattedNumber === q;
    }

    return true;
  });

  const handleClick = (ticket: Ticket) => {
    if (isAdmin && onAdminAction) {
      onAdminAction(ticket);
      return;
    }

    if (ticket.status === 'libre') {
      onSelectTicket(ticket);
    } else if (ticket.status === 'reservado') {
      const buyerFirstName = ticket.buyer_name ? ticket.buyer_name.split(' ')[0] : 'otra persona';
      showFeedback(`El número #${ticket.formattedNumber} está reservado por ${buyerFirstName}. Si no se confirma el pago, volverá a quedar libre.`);
    } else if (ticket.status === 'pagado') {
      showFeedback(`El número #${ticket.formattedNumber} ya ha sido pagado y confirmado. ¡Elige otro número libre! 😊`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border-2 border-indigo-100">
      {/* Grid header & fast search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-slate-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-gray-900 tracking-tight flex items-center gap-2">
            <span>Elige tu Papeleta</span>
            <span className="text-xs bg-yellow-300 text-yellow-950 px-2.5 py-1 rounded-full font-bold shadow-xs">
              00 al 99
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Toca tu número favorito en verde para reservarlo por Bizum y WhatsApp
          </p>
        </div>

        {/* Quick search input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            maxLength={2}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar número (ej: 07)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Floating feedback message */}
      {feedbackMessage && (
        <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-2xl text-yellow-950 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-yellow-800 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
        {filteredTickets.map((ticket) => {
          const isLibre = ticket.status === 'libre';
          const isReservado = ticket.status === 'reservado';
          const isPagado = ticket.status === 'pagado';

          return (
            <button
              key={ticket.number}
              type="button"
              onClick={() => handleClick(ticket)}
              className={`
                group relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-150 select-none aspect-square
                ${
                  isLibre
                    ? 'bg-emerald-50 hover:bg-emerald-400 hover:text-white border-emerald-300 hover:border-emerald-500 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer shadow-xs'
                    : isReservado
                    ? 'bg-amber-100 border-amber-300 text-amber-950 cursor-pointer hover:bg-amber-200 shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-pointer hover:bg-slate-200/80'
                }
                ${isAdmin ? 'ring-2 ring-indigo-400' : ''}
              `}
              title={`Número ${ticket.formattedNumber} - ${ticket.status.toUpperCase()}`}
            >
              {/* Number display */}
              <span
                className={`
                  font-black text-xl sm:text-2xl font-display tracking-tight transition-colors
                  ${isLibre ? 'text-emerald-800 group-hover:text-white' : ''}
                  ${isReservado ? 'text-amber-950' : ''}
                  ${isPagado ? 'text-slate-400 line-through decoration-slate-400' : ''}
                `}
              >
                {ticket.formattedNumber}
              </span>

              {/* Status indicator */}
              <div className="mt-0.5 flex items-center gap-0.5">
                {isLibre && (
                  <span className="text-[10px] font-bold text-emerald-700 group-hover:text-emerald-100 tracking-tight">
                    ¡Libre!
                  </span>
                )}
                {isReservado && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-800">
                    <Clock className="w-2.5 h-2.5" />
                    <span>Res.</span>
                  </span>
                )}
                {isPagado && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>OK</span>
                  </span>
                )}
              </div>

              {/* Dot badge for admin */}
              {isAdmin && ticket.buyer_name && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                  •
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm font-medium">
          No hay números que coincidan con la búsqueda.
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-5 border-t-2 border-slate-100 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-600 font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-emerald-100 border-2 border-emerald-400" />
          <span><strong>Verde:</strong> ¡Disponible para ti!</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
            <Clock className="w-2.5 h-2.5 text-amber-800" />
          </div>
          <span><strong>Amarillo:</strong> Reservado (esperando Bizum)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
          </div>
          <span><strong>Gris:</strong> Pagado y confirmado</span>
        </div>
      </div>
    </div>
  );
};
