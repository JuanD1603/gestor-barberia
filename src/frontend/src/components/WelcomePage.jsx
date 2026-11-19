import React from 'react';
import { Scissors, Phone, MapPin, Clock, ArrowRight, UserPlus, Instagram, Facebook } from 'lucide-react';
import heroBg from '../assets/barber-bg.jpg';

export default function WelcomePage({ onIniciarSesion, onRegistrarse }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden animate-fade-in bg-slate-950">
      {/* Imagen de fondo en blanco y negro */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="BarberShop Pro Background"
          className="w-full h-full object-cover object-center sm:object-right-top filter brightness-90 contrast-110"
        />
        {/* Capas de gradiente para contraste y legibilidad óptima */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Contenido Principal (Hero) */}
      <section className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Badge superior sutil */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
            <Scissors className="w-3.5 h-3.5 rotate-45 text-amber-400" />
            <span>BarberShop Pro • Cartago, Valle</span>
          </div>

          {/* Frase principal grande e impactante */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Hacemos de tu estilo una <span className="text-amber-400">declaración</span>.
          </h1>

          {/* Descripción limpia y concisa */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
            Cortes de alta precisión, cuidado de barba y barbería clásica. Reserva tu cita en segundos con tu barbero favorito y sin filas de espera.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onIniciarSesion}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 text-base group cursor-pointer"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={onRegistrarse}
              className="px-8 py-3.5 bg-slate-900/80 hover:bg-slate-800 hover:text-white active:scale-[0.99] text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2.5 text-base cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Crear Cuenta</span>
            </button>
          </div>
        </div>
      </section>

      {/* Barra Inferior de Información (Teléfono, Dirección, Horario y Redes) */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/85 backdrop-blur-md w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {/* Teléfono */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Atención & Reservas</p>
              <p className="text-sm font-bold text-white tracking-wide">+57 (314) 789-2045</p>
              <p className="text-[11px] text-slate-500">Llamadas y WhatsApp</p>
            </div>
          </div>

          {/* Dirección en Cartago, Valle */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ubicación</p>
              <p className="text-sm font-bold text-white tracking-wide">Cra. 4 # 12-48, Centro</p>
              <p className="text-[11px] text-slate-500">Cartago, Valle del Cauca</p>
            </div>
          </div>

          {/* Horario Lunes a Viernes */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Horario de Apertura</p>
              <p className="text-sm font-bold text-white tracking-wide">Lunes a Viernes</p>
              <p className="text-[11px] text-slate-500">8:00 AM – 8:00 PM (Sáb. hasta 7 PM)</p>
            </div>
          </div>

          {/* Redes Sociales y Marca */}
          <div className="flex items-center sm:justify-start lg:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">Síguenos:</span>
            <div className="flex items-center gap-2">
              <span
                title="Instagram @barbershop.pro"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 flex items-center justify-center transition cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </span>
              <span
                title="Facebook BarberShop Pro"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 flex items-center justify-center transition cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
