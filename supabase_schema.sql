-- ========================================================
-- ESQUEMA DE BASE DE DATOS PARA LA RIFA (SUPABASE)
-- Rifa: Viaje a Fátima de Lulú (00 al 99)
-- ========================================================
-- Copia y pega todo este código en el editor SQL de tu panel
-- de Supabase (SQL Editor -> New Query -> Run)
-- ========================================================

-- 1. Crear la tabla de papeletas
CREATE TABLE IF NOT EXISTS raffle_tickets (
    number INT PRIMARY KEY CHECK (number >= 0 AND number <= 99),
    status TEXT NOT NULL DEFAULT 'libre' CHECK (status IN ('libre', 'reservado', 'pagado')),
    buyer_name TEXT,
    buyer_phone TEXT,
    notes TEXT,
    reserved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insertar los 100 números del 0 al 99 (si no existen ya)
INSERT INTO raffle_tickets (number, status)
SELECT s.num, 'libre'
FROM generate_series(0, 99) AS s(num)
ON CONFLICT (number) DO NOTHING;

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE raffle_tickets ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de acceso público (anon)
-- Permitir lectura a cualquier visitante
CREATE POLICY "Permitir lectura publica de las papeletas"
ON raffle_tickets FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir reserva y actualización pública
CREATE POLICY "Permitir actualizar papeletas"
ON raffle_tickets FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Habilitar la sincronización en tiempo real (Realtime)
-- Esto permite que cuando alguien reserve, todos los móviles conectados
-- vean el número bloqueado en directo sin recargar la página.
ALTER PUBLICATION supabase_realtime ADD TABLE raffle_tickets;
