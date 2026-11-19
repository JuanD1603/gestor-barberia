import React, { useState } from 'react';
import { Scissors, Calendar, Search, ShieldCheck, LogOut, User, Package, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ETIQUETA_ROL, ROLES, pestanaInicial, pestanasDeRol } from '../roles';
import CatalogoCortesProductos from './CatalogoCortesProductos';

// Opciones de navegación: solo se muestran las que corresponden al rol del usuario en sesión
// (cliente: agendar y mis citas; barbero: su agenda; administrador: citas y administración).
function opcionesDePestana(rol) {
  return {
    booking: { etiqueta: 'Agendar Cita', Icono: Scissors },
    agenda: { etiqueta: 'Mi Agenda', Icono: Calendar },
    search: { etiqueta: rol === ROLES.ADMIN ? 'Citas' : 'Mis Citas', Icono: Search },
    admin: { etiqueta: 'Administración', Icono: ShieldCheck },
  };
}

export default function Navbar({ activeTab, setActiveTab, vistaPublica = 'bienvenida', onCambiarVistaPublica }) {
  const { usuario, rol, cerrarSesion } = useAuth();
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const opciones = opcionesDePestana(rol);
  const pestanas = pestanasDeRol(rol);

  const manejarClickLogo = () => {
    if (usuario) {
      setActiveTab(pestanaInicial(rol));
    } else if (onCambiarVistaPublica) {
      onCambiarVistaPublica('bienvenida');
    }
  };

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <div
            role="button"
            tabIndex={0}
            title="Ir al inicio"
            onClick={manejarClickLogo}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && manejarClickLogo()}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:border-amber-500/60 group-hover:bg-amber-500/20 transition">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                BarberShop <span className="text-amber-400 text-sm font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">Pro</span>
              </h1>
              <p className="text-xs text-slate-400">Sistema de Agendamiento</p>
            </div>
          </div>

          {!usuario && onCambiarVistaPublica && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMostrarCatalogo(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Ver Productos</span>
              </button>

              {vistaPublica !== 'bienvenida' && (
                <button
                  type="button"
                  onClick={() => onCambiarVistaPublica('bienvenida')}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                >
                  Inicio
                </button>
              )}
            </div>
          )}

          {usuario && (
            <>
              <nav className="flex items-center gap-1 sm:gap-2">
                {pestanas.map((id) => {
                  const { etiqueta, Icono } = opciones[id];
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      title={etiqueta}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-2 ${activeTab === id
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                          : 'text-slate-300 hover:bg-slate-800'
                        }`}
                    >
                      <Icono className="w-4 h-4" />
                      <span className="hidden sm:inline">{etiqueta}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:flex items-center gap-2 text-right">
                  <User className="w-4 h-4 text-slate-400" />
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-white max-w-[160px] truncate">{usuario.nombre}</p>
                    <p className="text-[11px] text-amber-400">{ETIQUETA_ROL[rol] || rol}</p>
                  </div>
                </div>
                <button
                  onClick={cerrarSesion}
                  title="Cerrar sesión"
                  className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-800 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Modal de Catálogo y Productos (Review de Productos para visitantes) */}
      {mostrarCatalogo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setMostrarCatalogo(false)}
            aria-hidden="true"
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-slate-950 overflow-hidden z-10">
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Catálogo de Productos y Estilos</h3>
                  <p className="text-xs text-slate-400">Productos capilares, para barba y estilos recomendados por nuestros barberos.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMostrarCatalogo(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido scrolleable con catálogo iniciando en Productos */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              <CatalogoCortesProductos tabInicial="productos" />
            </div>

            {/* Footer del Modal */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>Productos disponibles directamente en nuestra sede de Cartago, Valle.</p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setMostrarCatalogo(false)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium cursor-pointer"
                >
                  Cerrar
                </button>
                {onCambiarVistaPublica && (
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarCatalogo(false);
                      onCambiarVistaPublica('login');
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Agendar Cita</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
