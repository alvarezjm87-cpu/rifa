export type TicketStatus = 'libre' | 'reservado' | 'pagado';

export interface Ticket {
  number: number; // 0 to 99
  formattedNumber: string; // '00' to '99'
  status: TicketStatus;
  buyer_name?: string | null;
  buyer_phone?: string | null;
  reserved_at?: string | null;
  paid_at?: string | null;
  notes?: string | null;
}

export interface RaffleStats {
  total: number;
  libres: number;
  reservados: number;
  pagados: number;
  recaudado: number;
  totalObjetivo: number;
}
