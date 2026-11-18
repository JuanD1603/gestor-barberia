import React from 'react';
import { Scissors, Calendar, Search, ShieldCheck, LogOut, User } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ETIQUETA_ROL, ROLES, pestanaInicial, pestanasDeRol } from '../roles';

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
            {vistaPublica !== 'bienvenida' ? (
              <button
                type="button"
                onClick={() => onCambiarVistaPublica('bienvenida')}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              >
                Inicio
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onCambiarVistaPublica('login')}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => onCambiarVistaPublica('registro')}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md shadow-amber-500/20"
                >
                  Registrarse
                </button>
              </>
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
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-2 ${
                      activeTab === id
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
  );
}
