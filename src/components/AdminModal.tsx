'use client';

import React, { useState, useMemo } from 'react';
import { Ticket, TicketStatus } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import {
  X,
  Lock,
  Unlock,
  Check,
  RotateCcw,
  Download,
  Search,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  Send,
  Calendar,
  Copy,
  Users,
  CheckCheck,
  Sparkles,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  isAuthenticated: boolean;
  onAuthenticate: (pin: string) => boolean;
  onLogout: () => void;
  onUpdateStatus: (
    number: number,
    status: TicketStatus,
    buyerName?: string,
    buyerPhone?: string
  ) => Promise<void>;
}

interface BuyerGroup {
  name: string;
  phone: string;
  numbers: string[];
  allPaid: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  tickets,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onUpdateStatus,
}) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'reservado' | 'pagado' | 'libre'>('reservado');
  const [activeTab, setActiveTab] = useState<'tickets' | 'broadcast'>('tickets');
  const [drawDate, setDrawDate] = useState('Este viernes con el cupón de la ONCE');
  const [sentPhones, setSentPhones] = useState<string[]>([]);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [copiedPhones, setCopiedPhones] = useState(false);

  const [manualModalTicket, setManualModalTicket] = useState<Ticket | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');

  // Agrupar participantes únicos para no mandar mensajes repetidos si alguien compró 2 o más números (Hook ejecutado incondicionalmente)
  const buyerGroups: BuyerGroup[] = useMemo(() => {
    const map = new Map<string, BuyerGroup>();
    tickets
      .filter((t) => t.buyer_phone && t.status !== 'libre')
      .forEach((t) => {
        const cleanPhone = (t.buyer_phone || '').replace(/\D/g, '');
        if (!cleanPhone) return;
        const key = cleanPhone;
        if (!map.has(key)) {
          map.set(key, {
            name: t.buyer_name || 'Comprador',
            phone: cleanPhone,
            numbers: [t.formattedNumber],
            allPaid: t.status === 'pagado',
          });
        } else {
          const item = map.get(key)!;
          item.numbers.push(t.formattedNumber);
          if (t.status !== 'pagado') item.allPaid = false;
        }
      });
    return Array.from(map.values());
  }, [tickets]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAuthenticate(pin);
    if (!ok) {
      setPinError(true);
    } else {
      setPinError(false);
      setPin('');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Numero', 'Estado', 'Nombre_Comprador', 'Telefono_Comprador', 'Fecha_Reserva', 'Fecha_Pago'];
    const rows = tickets.map((t) => [
      t.formattedNumber,
      t.status,
      `"${(t.buyer_name || '').replace(/"/g, '""')}"`,
      `"${(t.buyer_phone || '').replace(/"/g, '""')}"`,
      t.reserved_at ? new Date(t.reserved_at).toLocaleString('es-ES') : '',
      t.paid_at ? new Date(t.paid_at).toLocaleString('es-ES') : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rifa_lulu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPersonalizedMessage = (group: BuyerGroup) => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const nums = group.numbers.join(', ');
    return `¡Hola ${group.name}! 👋🎒 Te escribo de parte de Lulú (1º de la ESO) para darte una gran noticia: ¡ya se han completado los números de la rifa para el viaje a Fátima! 🎉

Tus números que participan son: *${nums}*
Premio: *Paletilla de Jamón Ibérico + Queso* 🍖🧀
Fecha del Sorteo: *${drawDate}* (con las dos últimas cifras del sorteo de la ONCE).

Podrás comprobar el resultado en directo en nuestra web:
${url}

¡Muchísima suerte y gracias de corazón por colaborar con mi viaje! ❤️`;
  };

  const getGeneralBroadcastMessage = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    return `¡Hola a todos! 👋🎒 Os escribimos de parte de Lulú (1º de la ESO) para daros una súper noticia: ¡ya se han completado todos los números de la rifa para el viaje a Fátima! 🎉

🍖🧀 Premio: Paletilla de Jamón Ibérico + Queso
📅 Fecha del Sorteo: *${drawDate}* (con las dos últimas cifras del sorteo de la ONCE).

Podéis comprobar el resultado y verificar vuestros números en directo en la web:
${url}

¡Muchísima suerte a todos los participantes y gracias infinitas por vuestra ayuda! ❤️`;
  };

  const markPhoneAsSent = (phone: string) => {
    if (!sentPhones.includes(phone)) {
      setSentPhones((prev) => [...prev, phone]);
    }
  };

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(getGeneralBroadcastMessage());
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  const handleCopyPhones = () => {
    const phonesList = buyerGroups.map((b) => b.phone).join('\n');
    navigator.clipboard.writeText(phonesList);
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2500);
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const numMatch = t.formattedNumber.includes(q);
      const nameMatch = (t.buyer_name || '').toLowerCase().includes(q);
      const phoneMatch = (t.buyer_phone || '').toLowerCase().includes(q);
      return numMatch || nameMatch || phoneMatch;
    }
    return true;
  });

  const handleOpenManual = (t: Ticket) => {
    setManualModalTicket(t);
    setManualName(t.buyer_name || '');
    setManualPhone(t.buyer_phone || '');
  };

  const handleSaveManual = async (status: TicketStatus) => {
    if (!manualModalTicket) return;
    await onUpdateStatus(manualModalTicket.number, status, manualName, manualPhone);
    setManualModalTicket(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              {isAuthenticated ? (
                <Unlock className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Panel de Control del Organizador</h3>
              <p className="text-xs text-slate-400">
                {isAuthenticated
                  ? 'Gestiona números, confirma Bizums y notifica a los compradores'
                  : 'Introduce el PIN de administrador para acceder'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl transition-colors font-semibold"
              >
                Cerrar sesión
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switchers if authenticated */}
        {isAuthenticated && (
          <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
                activeTab === 'tickets'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Gestión de Números (100)</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all relative ${
                activeTab === 'broadcast'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 bg-emerald-50 border border-emerald-200'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Avisar del Sorteo a Todos</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            /* PIN form */
            <div className="max-w-xs mx-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-200 text-2xl">
                🔒
              </div>

              <div>
                <h4 className="font-display font-bold text-gray-900 text-xl">Acceso Administrativo</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Introduce el PIN para gestionar la rifa (PIN por defecto: <strong>1234</strong>)
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  maxLength={10}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN"
                  className="w-full text-center text-2xl tracking-widest px-4 py-2.5 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  autoFocus
                />

                {pinError && (
                  <p className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    PIN incorrecto. Inténtalo de nuevo.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm transition-all"
                >
                  Entrar al Panel
                </button>
              </form>
            </div>
          ) : activeTab === 'broadcast' ? (
            /* ========================================================
               TAB DE NOTIFICACIÓN Y DIFUSIÓN GENERAL A TODOS LOS TELÉFONOS
               ======================================================== */
            <div className="space-y-6">
              {/* Informative banner */}
              <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white p-5 rounded-3xl shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-display font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                      📢 Centro de Aviso de Sorteo
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black font-display">
                      Notificar la fecha del sorteo a los participantes
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                      Cuando la rifa esté completa, avisa a todos de qué día se realiza el sorteo de la ONCE. Los mensajes van personalizados con los números de cada persona.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-center flex-shrink-0">
                    <div className="text-2xl font-black font-display">{buyerGroups.length}</div>
                    <div className="text-[11px] text-emerald-100 font-semibold">Participantes únicos</div>
                  </div>
                </div>
              </div>

              {/* Configure Draw Date */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-3">
                <label className="block text-xs font-display font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Indica cuándo se celebrará el sorteo de la ONCE:</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={drawDate}
                    onChange={(e) => setDrawDate(e.target.value)}
                    placeholder="Ej: Este viernes 24 de Octubre con el sorteo de la ONCE"
                    className="flex-1 w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm bg-white"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyBroadcast}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs transition-all shadow-sm active:scale-95"
                      title="Copiar texto general para Estados de WhatsApp o Grupo"
                    >
                      {copiedBroadcast ? (
                        <>
                          <Check className="w-4 h-4 text-yellow-300" />
                          <span>¡Mensaje Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar para Estados / Grupo</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPhones}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-all"
                      title="Copiar lista de números para difusión"
                    >
                      {copiedPhones ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPhones ? 'Teléfonos Copiados' : 'Copiar Teléfonos'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
                <span>
                  Progreso de avisos:{' '}
                  <strong className="text-emerald-700 font-display font-black text-sm">
                    {sentPhones.length}
                  </strong>{' '}
                  de {buyerGroups.length} contactados
                </span>
                <span className="text-slate-400">
                  Pulsa el botón de WhatsApp al lado de cada participante para enviar su mensaje personalizado
                </span>
              </div>

              {/* List of Unique Buyers */}
              <div className="border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  {buyerGroups.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-medium">
                      Aún no hay compradores registrados con teléfono.
                    </div>
                  ) : (
                    buyerGroups.map((group) => {
                      const isSent = sentPhones.includes(group.phone);
                      const waUrl = `https://wa.me/34${group.phone}?text=${encodeURIComponent(
                        getPersonalizedMessage(group)
                      )}`;

                      return (
                        <div
                          key={group.phone}
                          className={`p-3.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                            isSent ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-display font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {group.numbers.length}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{group.name}</span>
                                {isSent && (
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                                    Avisado
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">
                                Teléfono: <span className="font-mono text-slate-700">{group.phone}</span> • Papeletas:{' '}
                                <strong className="text-indigo-600">
                                  #{group.numbers.join(', #')}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => markPhoneAsSent(group.phone)}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all shadow-sm active:scale-95 ${
                                isSent
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  : 'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-emerald-500/20'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{isSent ? 'Reenviar WhatsApp' : 'Enviar WhatsApp'}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               TAB DE GESTIÓN DE NÚMEROS (CONFIRMAR BIZUM / LIBERAR)
               ======================================================== */
            <div className="space-y-5">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por número, nombre o teléfono..."
                    className="w-full pl-9 pr-4 py-2 rounded-2xl border-2 border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-800 text-xs font-display font-bold transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Excel (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Status filter pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 mr-1">Filtrar:</span>
                {[
                  { id: 'reservado', label: 'Pendientes Bizum (Reservados)', color: 'amber' },
                  { id: 'pagado', label: 'Pagados (Confirmados)', color: 'emerald' },
                  { id: 'libre', label: 'Libres', color: 'slate' },
                  { id: 'all', label: 'Todos (100)', color: 'blue' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-display font-bold transition-all ${
                      filter === tab.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tickets table */}
              <div className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-gray-600 font-display font-bold sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Nº</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3">Comprador</th>
                        <th className="py-2.5 px-3">Teléfono</th>
                        <th className="py-2.5 px-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                            No se encontraron números con los filtros actuales.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((t) => (
                          <tr key={t.number} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-display font-black text-sm text-gray-900 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-xl">
                                {t.formattedNumber}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              {t.status === 'libre' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                                  Libre
                                </span>
                              )}
                              {t.status === 'reservado' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Reservado
                                </span>
                              )}
                              {t.status === 'pagado' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Pagado
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 font-semibold text-gray-800">
                              {t.buyer_name || <span className="text-gray-400 italic">Sin asignar</span>}
                            </td>

                            <td className="py-3 px-3 text-gray-600 font-mono">
                              {t.buyer_phone ? (
                                <div className="flex items-center gap-1.5">
                                  <span>{t.buyer_phone}</span>
                                  <a
                                    href={`https://wa.me/34${t.buyer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Hola ${t.buyer_name || ''}, te contacto respecto a tu número ${t.formattedNumber} para la rifa del viaje a Fátima.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700"
                                    title="Escribir por WhatsApp a este comprador"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                {t.status === 'reservado' && (
                                  <>
                                    <button
                                      onClick={() => onUpdateStatus(t.number, 'pagado')}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-[11px] shadow-sm transition-all"
                                      title="Confirmar recepción del Bizum"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Marcar Pagado</span>
                                    </button>

                                    <button
                                      onClick={() => onUpdateStatus(t.number, 'libre', '', '')}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition-all"
                                      title="Liberar número si no paga el Bizum"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      <span>Liberar</span>
                                    </button>
                                  </>
                                )}

                                {t.status === 'pagado' && (
                                  <button
                                    onClick={() => onUpdateStatus(t.number, 'libre', '', '')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-[11px] transition-all"
                                    title="Liberar este número"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Liberar</span>
                                  </button>
                                )}

                                {t.status === 'libre' && (
                                  <button
                                    onClick={() => handleOpenManual(t)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-display font-bold text-[11px] border border-amber-200 transition-all"
                                  >
                                    <UserPlus className="w-3 h-3" />
                                    <span>Asignar</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for manual assignment */}
        {manualModalTicket && (
          <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border-2 border-amber-200">
              <h4 className="font-display font-bold text-gray-900 text-sm">
                Asignar Número #{manualModalTicket.formattedNumber} manualmente
              </h4>

              <input
                type="text"
                placeholder="Nombre del comprador"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3 py-2 text-xs border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />

              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveManual('pagado')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs"
                >
                  Guardar Pagado
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveManual('reservado')}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs"
                >
                  Guardar Reservado
                </button>
              </div>

              <button
                type="button"
                onClick={() => setManualModalTicket(null)}
                className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
