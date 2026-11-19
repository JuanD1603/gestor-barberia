import React, { useState } from 'react';
import { Scissors, Package, ChevronRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Datos estáticos del catálogo — solo referencia visual, sin lógica de precios
// ---------------------------------------------------------------------------

const CORTES = [
  {
    id: 1,
    nombre: 'Fade Bajo',
    descripcion: 'Degradado gradual desde la nuca hacia arriba. Luce limpio y profesional.',
    etiqueta: 'Degradado',
    color: 'amber',
  },
  {
    id: 2,
    nombre: 'Fade Alto',
    descripcion: 'Degradado pronunciado con contraste marcado entre los lados y la parte superior.',
    etiqueta: 'Degradado',
    color: 'amber',
  },
  {
    id: 3,
    nombre: 'Fade Medio',
    descripcion: 'Punto intermedio entre el fade bajo y alto. Versátil para todo tipo de rostro.',
    etiqueta: 'Degradado',
    color: 'amber',
  },
  {
    id: 4,
    nombre: 'Corte Clásico',
    descripcion: 'Tijera con volumen natural. Atemporal y elegante para cualquier ocasión.',
    etiqueta: 'Clásico',
    color: 'slate',
  },
  {
    id: 5,
    nombre: 'Undercut',
    descripcion: 'Lados completamente rapados con la parte superior larga. Estilo urbano y moderno.',
    etiqueta: 'Moderno',
    color: 'emerald',
  },
  {
    id: 6,
    nombre: 'Pompadour',
    descripcion: 'Volumen hacia arriba y atrás. Clásico del rock con un toque contemporáneo.',
    etiqueta: 'Retro',
    color: 'violet',
  },
  {
    id: 7,
    nombre: 'Buzz Cut',
    descripcion: 'Rapado uniforme al ras en toda la cabeza. Mínimo mantenimiento, máximo impacto.',
    etiqueta: 'Corto',
    color: 'slate',
  },
  {
    id: 8,
    nombre: 'Textured Crop',
    descripcion: 'Flequillo texturizado con lados cortos. Tendencia europea de alto impacto.',
    etiqueta: 'Tendencia',
    color: 'emerald',
  },
  {
    id: 9,
    nombre: 'Quiff',
    descripcion: 'Volumen al frente levantado. Combina lo clásico y lo moderno en un solo estilo.',
    etiqueta: 'Clásico',
    color: 'violet',
  },
  {
    id: 10,
    nombre: 'French Crop',
    descripcion: 'Flequillo recto y lados cortos. Elegante y de fácil mantenimiento diario.',
    etiqueta: 'Moderno',
    color: 'amber',
  },
  {
    id: 11,
    nombre: 'Slick Back',
    descripcion: 'Cabello peinado hacia atrás con fijación. Estilo ejecutivo con actitud.',
    etiqueta: 'Clásico',
    color: 'slate',
  },
  {
    id: 12,
    nombre: 'Caesar Cut',
    descripcion: 'Flequillo horizontal hacia adelante con largo uniforme. Sobrio y masculino.',
    etiqueta: 'Clásico',
    color: 'emerald',
  },
];

const ESTILOS_BARBA = [
  {
    id: 1,
    nombre: 'Barba Corta Perfilada',
    descripcion: 'Vello corto y bien definido. Aspecto prolijo sin esfuerzo.',
    etiqueta: 'Corta',
    color: 'amber',
  },
  {
    id: 2,
    nombre: 'Barba Larga Cuidada',
    descripcion: 'Largo generoso con bordes definidos. Transmite madurez y personalidad.',
    etiqueta: 'Larga',
    color: 'slate',
  },
  {
    id: 3,
    nombre: 'Barba de Candado',
    descripcion: 'Recorre el mentón y el bigote formando un marco. Sofisticado y atemporal.',
    etiqueta: 'Estilizada',
    color: 'violet',
  },
  {
    id: 4,
    nombre: 'Barba Van Dyke',
    descripcion: 'Bigote fino y perilla separada. Inspirado en el artista flamenco, muy definido.',
    etiqueta: 'Estilizada',
    color: 'emerald',
  },
  {
    id: 5,
    nombre: 'Barba Garibaldi',
    descripcion: 'Ancha y redondeada en la parte inferior. Natural con un toque de distinción.',
    etiqueta: 'Larga',
    color: 'amber',
  },
  {
    id: 6,
    nombre: 'Stubble (Rastrojo)',
    descripcion: 'Vello de 3 a 5 días. El estilo más espontáneo y muy popular actualmente.',
    etiqueta: 'Corta',
    color: 'slate',
  },
];

const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Pomada Mate',
    descripcion: 'Fijación fuerte con acabado opaco. Ideal para estilos texturizados y naturales.',
    uso: 'Estilizado',
    color: 'amber',
  },
  {
    id: 2,
    nombre: 'Pomada Brillante',
    descripcion: 'Fijación media-alta con acabado brillante. Perfecta para Pompadour y Slick Back.',
    uso: 'Estilizado',
    color: 'amber',
  },
  {
    id: 3,
    nombre: 'Aceite de Barba',
    descripcion: 'Hidratación y brillo natural para la barba. Suaviza el vello y nutre la piel.',
    uso: 'Barba',
    color: 'emerald',
  },
  {
    id: 4,
    nombre: 'Bálsamo de Barba',
    descripcion: 'Acondicionador en crema para barba larga. Doma, hidrata y da forma sin pesar.',
    uso: 'Barba',
    color: 'emerald',
  },
  {
    id: 5,
    nombre: 'Cera Moldeadora',
    descripcion: 'Textura flexible y acabado natural. Permite remodelado durante el día.',
    uso: 'Estilizado',
    color: 'violet',
  },
  {
    id: 6,
    nombre: 'Spray Fijador',
    descripcion: 'Sello final de larga duración. Mantiene el estilo ante la humedad y el viento.',
    uso: 'Fijación',
    color: 'slate',
  },
  {
    id: 7,
    nombre: 'Champú Anticaspa',
    descripcion: 'Elimina la caspa con extractos naturales. Deja el cuero cabelludo equilibrado.',
    uso: 'Cuidado',
    color: 'slate',
  },
  {
    id: 8,
    nombre: 'Crema de Afeitar',
    descripcion: 'Espuma densa para un afeitado suave y sin irritaciones. Con aloe vera y glicerina.',
    uso: 'Afeitado',
    color: 'amber',
  },
];

// ---------------------------------------------------------------------------
// Configuración de colores por etiqueta
// ---------------------------------------------------------------------------

const COLORES_ETIQUETA = {
  amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
  slate: 'bg-slate-700/50 text-slate-300 border border-slate-700',
};

// ---------------------------------------------------------------------------
// Icono SVG de tijera para representar cortes (sin emoji)
// ---------------------------------------------------------------------------

function IconoCorte({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Tarjeta de ítem del catálogo
// ---------------------------------------------------------------------------

function TarjetaCatalogo({ nombre, descripcion, etiqueta, color }) {
  const claseEtiqueta = COLORES_ETIQUETA[color] ?? COLORES_ETIQUETA.slate;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-700 transition group">
      {/* Cabecera con nombre y etiqueta */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-white text-sm leading-snug">{nombre}</h4>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${claseEtiqueta}`}>
          {etiqueta}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-slate-400 text-xs leading-relaxed flex-1">{descripcion}</p>

      {/* Pie de tarjeta con indicador visual */}
      <div className="flex items-center gap-1 text-slate-500 text-[11px] group-hover:text-slate-400 transition">
        <ChevronRight className="w-3 h-3" />
        <span>Consulta con tu barbero</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs internos de navegación del catálogo
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'cortes', label: 'Cortes', Icon: IconoCorte, conteo: CORTES.length },
  { id: 'barba', label: 'Estilos de Barba', Icon: Scissors, conteo: ESTILOS_BARBA.length },
  { id: 'productos', label: 'Productos', Icon: Package, conteo: PRODUCTOS.length },
];

// ---------------------------------------------------------------------------
// Componente principal exportado
// ---------------------------------------------------------------------------

export default function CatalogoCortesProductos() {
  const [tabActiva, setTabActiva] = useState('cortes');

  const renderContenido = () => {
    if (tabActiva === 'cortes') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CORTES.map((item) => (
            <TarjetaCatalogo
              key={item.id}
              nombre={item.nombre}
              descripcion={item.descripcion}
              etiqueta={item.etiqueta}
              color={item.color}
            />
          ))}
        </div>
      );
    }

    if (tabActiva === 'barba') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ESTILOS_BARBA.map((item) => (
            <TarjetaCatalogo
              key={item.id}
              nombre={item.nombre}
              descripcion={item.descripcion}
              etiqueta={item.etiqueta}
              color={item.color}
            />
          ))}
        </div>
      );
    }

    if (tabActiva === 'productos') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PRODUCTOS.map((item) => (
            <TarjetaCatalogo
              key={item.id}
              nombre={item.nombre}
              descripcion={item.descripcion}
              etiqueta={item.uso}
              color={item.color}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {/* Aviso informativo */}
      <div className="mb-5 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 leading-relaxed">
        Este catálogo es de referencia visual. Comparte el estilo que prefieres con tu barbero al llegar a tu cita.
        Los precios se calculan segun los servicios que selecciones en la pestana anterior.
      </div>

      {/* Tabs de navegacion interna */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-5" role="tablist">
        {TABS.map(({ id, label, Icon, conteo }) => {
          const activa = tabActiva === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => setTabActiva(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activa
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activa ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {conteo}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contenido de la tab activa */}
      {renderContenido()}
    </div>
  );
}

