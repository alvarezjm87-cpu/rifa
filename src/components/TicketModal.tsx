'use client';

import React, { useState, useEffect } from 'react';
import { Ticket } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { X, Copy, Check, MessageCircle, AlertCircle, Sparkles, Phone, User, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (ticketNumber: number, name: string, phone: string) => Promise<boolean>;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onReserve,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [copiedBizum, setCopiedBizum] = useState(false);
  const [copiedConcept, setCopiedConcept] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setError(null);
      setStep('form');
      setCopiedBizum(false);
      setCopiedConcept(false);
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  const conceptText = `${RAFFLE_CONFIG.payment.conceptPrefix} - Nº ${ticket.formattedNumber} - ${name.trim() || 'Tu Nombre'}`;

  const copyToClipboard = (text: string, type: 'bizum' | 'concept') => {
    navigator.clipboard.writeText(text);
    if (type === 'bizum') {
      setCopiedBizum(true);
      setTimeout(() => setCopiedBizum(false), 2000);
    } else {
      setCopiedConcept(true);
      setTimeout(() => setCopiedConcept(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, indica tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('Por favor, introduce un teléfono válido (al menos 9 dígitos).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onReserve(ticket.number, name.trim(), phone.trim());

      if (success) {
        // Redactar mensaje de WhatsApp con tono simpático de cole
        const waMessage = 
`¡Hola Lulú! 👋🎒 Acabo de reservar el número *${ticket.formattedNumber}* para ayudarte con el viaje a Fátima del cole.

👤 Nombre: *${name.trim()}*
📱 Teléfono: *${phone.trim()}*
💶 Importe: *${RAFFLE_CONFIG.pricePerNumber}€*
📝 Concepto Bizum: *${conceptText}*

Te adjunto el justificante del Bizum a continuación. ¡Buen viaje! ✨`;

        const waUrl = `https://wa.me/${RAFFLE_CONFIG.organizer.whatsappPhone}?text=${encodeURIComponent(waMessage)}`;
        setLastWhatsAppUrl(waUrl);

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        window.open(waUrl, '_blank');
        setStep('success');
      } else {
        setError('¡Vaya! Este número se acaba de reservar hace un momento. Por favor, elige otro número libre.');
      }
    } catch (err: any) {
      setError(err?.message || 'Hubo un error al reservar. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-indigo-600 to-sky-500 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-yellow-300 text-yellow-950 font-display font-black text-2xl flex items-center justify-center shadow-md border-2 border-white sticker-tilt-1">
              {ticket.formattedNumber}
            </span>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Papeleta Nº {ticket.formattedNumber}
              </h3>
              <p className="text-pink-100 text-xs font-medium">
                Precio: <span className="font-bold text-yellow-200">{RAFFLE_CONFIG.pricePerNumber} €</span> • {RAFFLE_CONFIG.student.grade}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bizum instructions box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-display font-bold text-amber-950 uppercase tracking-tight">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    Cómo pagar tu papeleta (Bizum)
                  </div>
                  <span className="text-sm font-display font-black text-pink-700 bg-pink-100 border border-pink-200 px-2.5 py-0.5 rounded-lg">
                    {RAFFLE_CONFIG.pricePerNumber} €
                  </span>
                </div>

                {/* Copiar teléfono Bizum */}
                <div className="flex items-center justify-between bg-white border-2 border-amber-200 rounded-xl p-2.5 px-3 shadow-xs">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 block">Número para el Bizum:</span>
                    <span className="text-base font-display font-black text-gray-900 tracking-wider">
                      {RAFFLE_CONFIG.payment.bizumPhone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(RAFFLE_CONFIG.payment.bizumPhone, 'bizum')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-yellow-950 text-xs font-display font-bold transition-colors active:scale-95"
                  >
                    {copiedBizum ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Copiar Concepto */}
                <div className="flex items-center justify-between bg-white border-2 border-amber-200 rounded-xl p-2.5 px-3 shadow-xs">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[11px] font-bold text-gray-500 block">Concepto sugerido:</span>
                    <span className="text-xs font-bold text-gray-800 truncate block">
                      {conceptText}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(conceptText, 'concept')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-yellow-950 text-xs font-display font-bold transition-colors active:scale-95 flex-shrink-0"
                  >
                    {copiedConcept ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    Tu Nombre y Apellidos <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carmen Martínez"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    Tu Teléfono de contacto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 612 34 56 78"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
                  />
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">
                    Te contactaremos a este número para darte el jamón y el queso si resultas ganador.
                  </p>
                </div>
              </div>

              {/* WhatsApp submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-display font-bold text-sm sm:text-base shadow-lg shadow-green-500/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>
                    {isSubmitting ? 'Bloqueando tu número...' : 'Bloquear Número y Enviar WhatsApp 📲'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-2 font-medium">
                  Al pulsar, se reservará el número y se abrirá WhatsApp con el mensaje listo.
                </p>
              </div>
            </form>
          ) : (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner text-3xl">
                🎒
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black font-display text-gray-900">
                  ¡Papeleta #{ticket.formattedNumber} Reservada!
                </h4>
                <p className="text-sm text-gray-600 max-w-sm mx-auto font-medium">
                  Hemos guardado tu número a nombre de <strong className="text-gray-900">{name}</strong>. ¡Muchísimas gracias por ayudar a Lulú! ❤️
                </p>
              </div>

              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-xs text-sky-900 text-left font-medium space-y-1">
                <p>
                  <strong>Siguiente paso:</strong> Si no se ha abierto WhatsApp de forma automática en tu teléfono, pulsa el botón verde para enviar el justificante del Bizum a los papás de Lulú.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Abrir WhatsApp Ahora</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Volver al tablero de la rifa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
