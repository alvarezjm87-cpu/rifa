import { createClient } from '@supabase/supabase-js';
import { Ticket } from '@/types/raffle';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('TU_PROYECTO_AQUI')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para formatear número a dos dígitos (0 -> "00", 5 -> "05")
export const formatTicketNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

// Generar array inicial de 100 papeletas
export const generateInitialTickets = (): Ticket[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    number: i,
    formattedNumber: formatTicketNumber(i),
    status: 'libre',
    buyer_name: null,
    buyer_phone: null,
    reserved_at: null,
    paid_at: null,
    notes: null,
  }));
};

// Fallback de LocalStorage para cuando aún no se ha configurado Supabase
const LOCAL_STORAGE_KEY = 'rifa_lulu_tickets_v1';

export const getLocalTickets = (): Ticket[] => {
  if (typeof window === 'undefined') return generateInitialTickets();
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      const initial = generateInitialTickets();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error al leer de LocalStorage:', e);
    return generateInitialTickets();
  }
};

export const saveLocalTickets = (tickets: Ticket[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error al guardar en LocalStorage:', e);
  }
};
