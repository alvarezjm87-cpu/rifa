'use client';

import React, { useRef, useState } from 'react';
import { Ticket, RaffleStats } from '@/types/raffle';
import { RAFFLE_CONFIG } from '@/config/raffle';
import { X, Camera, Download, Check, Sparkles, Heart } from 'lucide-react';
import { JamonIcon } from './JamonIcon';
import { QuesoIcon } from './QuesoIcon';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  stats: RaffleStats;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  tickets,
  stats,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Función para generar y descargar la imagen automáticamente usando Canvas nativo
  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dimensiones ideales para Estado de WhatsApp / Story vertical (1080 x 1920)
      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;

      // Fondo degradado suave escolar
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#38BDF8'); // Sky blue
      bgGrad.addColorStop(0.3, '#818CF8'); // Indigo
      bgGrad.addColorStop(0.7, '#F472B6'); // Pink
      bgGrad.addColorStop(1, '#FB923C'); // Orange
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Tarjeta blanca central
      const cardMargin = 50;
      const cardW = width - (cardMargin * 2);
      const cardH = height - 120;
      const cardX = cardMargin;
      const cardY = 60;

      // Dibujar tarjeta blanca con esquinas redondeadas
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      const r = 40;
      ctx.beginPath();
      ctx.moveTo(cardX + r, cardY);
      ctx.lineTo(cardX + cardW - r, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
      ctx.lineTo(cardX + cardW, cardY + cardH - r);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardH + cardY);
      ctx.lineTo(cardX + r, cardH + cardY);
      ctx.quadraticCurveTo(cardX, cardH + cardY, cardX, cardH + cardY - r);
      ctx.lineTo(cardX, cardY + r);
      ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Borde festivo amarillo
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#FCD34D';
      ctx.stroke();

      // Cabecera de la tarjeta
      ctx.textAlign = 'center';
      
      // Sticker "1º de la ESO"
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect((width / 2) - 180, cardY + 40, 360, 48);
      ctx.fillStyle = '#713F12';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('🎒 COLEGIO • 1º DE LA ESO', width / 2, cardY + 73);

      // Título principal
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 64px system-ui, sans-serif';
      ctx.fillText('¡LA RIFA DE LULÚ! ✨', width / 2, cardY + 160);

      // Subtítulo
      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.fillText('Viaje a Fátima • 3€ por número', width / 2, cardY + 215);

      // Premio destacado
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.fillText('🍖 Premio: Paletilla de Jamón + Queso 🧀', width / 2, cardY + 265);

      // Contadores de estado
      const libres = stats.libres;
      const res = stats.reservados;
      const pag = stats.pagados;

      ctx.font = 'bold 24px system-ui, sans-serif';
      // Pill Libres
      ctx.fillStyle = '#D1FAE5';
      ctx.fillRect((width / 2) - 340, cardY + 300, 210, 45);
      ctx.fillStyle = '#065F46';
      ctx.fillText(`🟢 ${libres} Libres`, (width / 2) - 235, cardY + 332);

      // Pill Reservados
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect((width / 2) - 105, cardY + 300, 210, 45);
      ctx.fillStyle = '#92400E';
      ctx.fillText(`🟡 ${res} Reservados`, width / 2, cardY + 332);

      // Pill Confirmados
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect((width / 2) + 130, cardY + 300, 210, 45);
      ctx.fillStyle = '#334155';
      ctx.fillText(`⚫ ${pag} Pagados`, (width / 2) + 235, cardY + 332);

      // Cuadrícula 10x10 de Números (00 al 99)
      const gridStartY = cardY + 375;
      const cellSize = 88;
      const cellGap = 8;
      const gridTotalWidth = (10 * cellSize) + (9 * cellGap);
      const gridStartX = (width - gridTotalWidth) / 2;

      tickets.forEach((t) => {
        const col = t.number % 10;
        const row = Math.floor(t.number / 10);
        const x = gridStartX + (col * (cellSize + cellGap));
        const y = gridStartY + (row * (cellSize + cellGap));

        // Color de fondo de la celda según estado
        if (t.status === 'libre') {
          ctx.fillStyle = '#ECFDF5';
          ctx.strokeStyle = '#6EE7B7';
        } else if (t.status === 'reservado') {
          ctx.fillStyle = '#FDE68A';
          ctx.strokeStyle = '#F59E0B';
        } else {
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#1E293B';
        }

        // Dibujar celda con esquinas redondeadas
        const cr = 14;
        ctx.beginPath();
        ctx.moveTo(x + cr, y);
        ctx.lineTo(x + cellSize - cr, y);
        ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + cr);
        ctx.lineTo(x + cellSize, y + cellSize - cr);
        ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - cr, y + cellSize);
        ctx.lineTo(x + cr, y + cellSize);
        ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - cr);
        ctx.lineTo(x, y + cr);
        ctx.quadraticCurveTo(x, y, x + cr, y);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        // Texto del número
        if (t.status === 'libre') {
          ctx.fillStyle = '#065F46';
        } else if (t.status === 'reservado') {
          ctx.fillStyle = '#78350F';
        } else {
          ctx.fillStyle = '#FFFFFF';
        }
        ctx.font = '900 38px system-ui, sans-serif';
        ctx.fillText(t.formattedNumber, x + (cellSize / 2), y + (cellSize / 2) + 13);
      });

      // Pie de la tarjeta
      const footerY = gridStartY + (10 * (cellSize + cellGap)) + 25;

      // Leyenda
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('🟢 Verde = Libre  •  🟡 Amarillo = Reservado  •  ⚫ Gris = Pagado', width / 2, footerY + 20);

      // Caja de contacto y web
      const boxW = 860;
      const boxH = 110;
      const boxX = (width - boxW) / 2;
      const boxY = footerY + 50;

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0284C7';
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#0F172A';
      ctx.font = '900 32px system-ui, sans-serif';
      ctx.fillText('📲 Pide tu número por Bizum / WhatsApp: 662 357 153', width / 2, boxY + 45);

      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText('🌐 rifa-eight-mu.vercel.app', width / 2, boxY + 90);

      // Convertir a imagen y descargar
      const link = document.createElement('a');
      link.download = `estado_rifa_lulu_${new Date().toISOString().slice(0, 10)}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Error al generar imagen de estado:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md my-auto flex flex-col items-center">
        
        {/* Top Control Bar (Fuera de la tarjeta para no ensuciar el pantallazo) */}
        <div className="w-full flex items-center justify-between gap-2 mb-2 text-white">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Camera className="w-4 h-4 text-yellow-300" />
            <span>Listo para captura</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              title="Descargar imagen en alta resolución para subir a estados"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Foto</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              title="Cerrar vista"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            TARJETA COMPACTA 100 NÚMEROS (IDEAL PARA PANTALLAZO MÓVIL)
            Diseñada con proporciones verticales exactas para caber
            en 1 sola pantalla de móvil sin necesidad de hacer scroll
            ======================================================== */}
        <div
          ref={cardRef}
          className="w-full bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border-4 border-amber-300 select-none text-slate-800 space-y-2.5"
        >
          {/* Header compacto */}
          <div className="text-center space-y-0.5 border-b pb-2 border-slate-100">
            <div className="inline-block bg-yellow-100 text-yellow-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              🎒 1º DE LA ESO • VIAJE A FÁTIMA 🚌
            </div>
            
            <h3 className="text-lg sm:text-xl font-black font-display text-slate-900 leading-tight">
              ¡LA RIFA DE LULÚ! ✨
            </h3>

            <p className="text-xs font-bold text-pink-600">
              🍖 Paletilla + Queso 🧀 • <span className="underline">3€ / número</span>
            </p>

            {/* Badges de estado en tiempo real */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                🟢 {stats.libres} Libres
              </span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                🟡 {stats.reservados} Reservados
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-300">
                ⚫ {stats.pagados} Pagados
              </span>
            </div>
          </div>

          {/* CUADRÍCULA COMPACTA DE LOS 100 NÚMEROS (10x10) */}
          <div className="grid grid-cols-10 gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200">
            {tickets.map((t) => {
              const isLibre = t.status === 'libre';
              const isReservado = t.status === 'reservado';
              const isPagado = t.status === 'pagado';

              return (
                <div
                  key={t.number}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm transition-all
                    ${
                      isLibre
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                        : isReservado
                        ? 'bg-amber-300 text-amber-950 font-black border border-amber-400 shadow-xs animate-pulse'
                        : 'bg-slate-700 text-white font-bold border border-slate-800'
                    }
                  `}
                  title={`#${t.formattedNumber} - ${t.status}`}
                >
                  {t.formattedNumber}
                </div>
              );
            })}
          </div>

          {/* Footer compacto con instrucciones */}
          <div className="text-center space-y-1 pt-1">
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 font-bold">
              <span>🟢 Libre</span>
              <span>🟡 Reservado</span>
              <span>⚫ Pagado</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-1.5 text-center">
              <div className="text-xs font-black text-slate-900">
                📲 Bizum / WhatsApp: <span className="text-emerald-700">662 357 153</span>
              </div>
              <div className="text-[11px] font-bold text-sky-600">
                🌐 rifa-eight-mu.vercel.app
              </div>
            </div>
          </div>
        </div>

        {/* Tip inferior */}
        <p className="text-center text-white/80 text-[11px] font-medium mt-2">
          📸 ¡Haz una captura de pantalla a este recuadro para subirlo directo a tu Estado de WhatsApp!
        </p>
      </div>
    </div>
  );
};
