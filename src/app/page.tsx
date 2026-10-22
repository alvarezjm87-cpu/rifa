'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Ticket, TicketStatus, RaffleStats } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import {
  supabase,
  isSupabaseConfigured,
  generateInitialTickets,
  getLocalTickets,
  saveLocalTickets,
  formatTicketNumber,
} from '@/lib/supabase';
import { Header } from '@/components/Header';
import { PrizeCard } from '@/components/PrizeCard';
import { StatsBar } from '@/components/StatsBar';
import { RaffleGrid } from '@/components/RaffleGrid';
import { TicketModal } from '@/components/TicketModal';
import { AdminModal } from '@/components/AdminModal';
import { WinnerChecker } from '@/components/WinnerChecker';
import { Database, ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'libres' | 'reservados' | 'pagados'>('todos');
  const [isLoading, setIsLoading] = useState(true);

  // Check admin session on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('rifa_admin_auth');
      if (auth === 'true') {
        setIsAdminAuthenticated(true);
      }
    }
  }, []);

  // Cargar números (desde Supabase o LocalStorage)
  const loadTickets = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('raffle_tickets')
          .select('*')
          .order('number', { ascending: true });

        if (error) {
          console.error('Error al cargar tickets de Supabase:', error);
          setTickets(getLocalTickets());
        } else if (data && data.length > 0) {
          const formatted: Ticket[] = data.map((row: any) => ({
            number: row.number,
            formattedNumber: formatTicketNumber(row.number),
            status: row.status,
            buyer_name: row.buyer_name,
            buyer_phone: row.buyer_phone,
            reserved_at: row.reserved_at,
            paid_at: row.paid_at,
            notes: row.notes,
          }));
          setTickets(formatted);
        } else {
          // Si la tabla existe pero está vacía, mostrar números generados
          setTickets(generateInitialTickets());
        }
      } catch (err) {
        console.error('Error de conexión a Supabase:', err);
        setTickets(getLocalTickets());
      }
    } else {
      // Modo LocalStorage
      setTickets(getLocalTickets());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTickets();

    // Sincronización en TIEMPO REAL si Supabase está activo
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const channel = client
        .channel('raffle_realtime_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'raffle_tickets' },
          (payload) => {
            if (payload.new && (payload.new as any).number !== undefined) {
              const updatedRow: any = payload.new;
              setTickets((prev) =>
                prev.map((t) =>
                  t.number === updatedRow.number
                    ? {
                        ...t,
                        status: updatedRow.status,
                        buyer_name: updatedRow.buyer_name,
                        buyer_phone: updatedRow.buyer_phone,
                        reserved_at: updatedRow.reserved_at,
                        paid_at: updatedRow.paid_at,
                        notes: updatedRow.notes,
                      }
                    : t
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, [loadTickets]);

  // Calcular estadísticas
  const stats: RaffleStats = useMemo(() => {
    const total = RAFFLE_CONFIG.totalNumbers;
    const libres = tickets.filter((t) => t.status === 'libre').length;
    const reservados = tickets.filter((t) => t.status === 'reservado').length;
    const pagados = tickets.filter((t) => t.status === 'pagado').length;
    const recaudado = pagados * RAFFLE_CONFIG.pricePerNumber;
    const totalObjetivo = total * RAFFLE_CONFIG.pricePerNumber;

    return {
      total,
      libres,
      reservados,
      pagados,
      recaudado,
      totalObjetivo,
    };
  }, [tickets]);

  // Manejar reserva de un número
  const handleReserve = async (ticketNumber: number, name: string, phone: string): Promise<boolean> => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('raffle_tickets')
          .update({
            status: 'reservado',
            buyer_name: name,
            buyer_phone: phone,
            reserved_at: now,
          })
          .eq('number', ticketNumber)
          .eq('status', 'libre') // Previene colisiones si dos personas intentan reservar a la vez
          .select();

        if (error || !data || data.length === 0) {
          console.error('Error al actualizar en Supabase:', error);
          return false;
        }

        // Actualizar estado local inmediatamente
        setTickets((prev) =>
          prev.map((t) =>
            t.number === ticketNumber
              ? {
                  ...t,
                  status: 'reservado',
                  buyer_name: name,
                  buyer_phone: phone,
                  reserved_at: now,
                }
              : t
          )
        );
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      // Modo LocalStorage
      const current = tickets.find((t) => t.number === ticketNumber);
      if (!current || current.status !== 'libre') {
        return false;
      }

      const updated = tickets.map((t) =>
        t.number === ticketNumber
          ? {
              ...t,
              status: 'reservado' as TicketStatus,
              buyer_name: name,
              buyer_phone: phone,
              reserved_at: now,
            }
          : t
      );
      setTickets(updated);
      saveLocalTickets(updated);
      return true;
    }
  };

  // Manejar actualización desde Admin
  const handleAdminUpdateStatus = async (
    number: number,
    status: TicketStatus,
    buyerName?: string,
    buyerPhone?: string
  ) => {
    const now = new Date().toISOString();
    const isPaying = status === 'pagado';
    const isReleasing = status === 'libre';

    if (isSupabaseConfigured && supabase) {
      try {
        const updateData: any = {
          status,
          updated_at: now,
        };

        if (isPaying) {
          updateData.paid_at = now;
        } else if (isReleasing) {
          updateData.buyer_name = null;
          updateData.buyer_phone = null;
          updateData.reserved_at = null;
          updateData.paid_at = null;
        }

        if (buyerName !== undefined) updateData.buyer_name = buyerName || null;
        if (buyerPhone !== undefined) updateData.buyer_phone = buyerPhone || null;

        await supabase.from('raffle_tickets').update(updateData).eq('number', number);

        setTickets((prev) =>
          prev.map((t) =>
            t.number === number
              ? {
                  ...t,
                  status,
                  buyer_name: isReleasing ? null : buyerName ?? t.buyer_name,
                  buyer_phone: isReleasing ? null : buyerPhone ?? t.buyer_phone,
                  paid_at: isPaying ? now : isReleasing ? null : t.paid_at,
                  reserved_at: isReleasing ? null : t.reserved_at,
                }
              : t
          )
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      const updated = tickets.map((t) => {
        if (t.number === number) {
          return {
            ...t,
            status,
            buyer_name: isReleasing ? null : buyerName !== undefined ? buyerName : t.buyer_name,
            buyer_phone: isReleasing ? null : buyerPhone !== undefined ? buyerPhone : t.buyer_phone,
            paid_at: isPaying ? now : isReleasing ? null : t.paid_at,
            reserved_at: isReleasing ? null : t.reserved_at,
          };
        }
        return t;
      });
      setTickets(updated);
      saveLocalTickets(updated);
    }
  };

  // Autenticación de Admin
  const handleAuthenticate = (pin: string): boolean => {
    const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || RAFFLE_CONFIG.admin.defaultPin;
    if (pin === expectedPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('rifa_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('rifa_admin_auth');
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 sm:-mt-6 relative z-20">
        {/* Supabase status notice if running locally */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Modo Demo / Local Activo:</strong> Los números se guardan en tu navegador. Para conectar la base de datos en tiempo real de Supabase antes de compartir en Vercel, añade tus claves en <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">.env.local</code>.
              </span>
            </div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-sm transition-all"
            >
              Acceso Admin
            </button>
          </div>
        )}

        {/* Prize Card */}
        <PrizeCard />

        {/* Stats and Filter Bar */}
        <StatsBar
          stats={stats}
          currentFilter={filter}
          onFilterChange={(newFilter) => setFilter(newFilter)}
        />

        {/* Raffle Numbers Grid */}
        <RaffleGrid
          tickets={tickets}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          isAdmin={isAdminAuthenticated}
          onAdminAction={(ticket) => {
            // Si admin hace clic en el tablero, abre el modal de admin directamente
            setIsAdminOpen(true);
          }}
          filter={filter}
        />

        {/* ONCE Lottery Winner Checker */}
        <WinnerChecker tickets={tickets} />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500 space-y-2 pb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 px-4 py-1.5 rounded-full shadow-xs">
            <span>🎒 Organizado con</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>para el viaje a Fátima de {RAFFLE_CONFIG.organizer.name} ({RAFFLE_CONFIG.student.grade})</span>
          </div>
          <p className="text-gray-400 font-medium">
            Contacto para dudas o Bizum: {RAFFLE_CONFIG.organizer.phone}
          </p>
        </footer>
      </div>

      {/* Ticket Reservation Modal */}
      <TicketModal
        ticket={selectedTicket}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        onReserve={handleReserve}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        tickets={tickets}
        isAuthenticated={isAdminAuthenticated}
        onAuthenticate={handleAuthenticate}
        onLogout={handleLogout}
        onUpdateStatus={handleAdminUpdateStatus}
      />
    </main>
  );
}
