import React from 'react';
import { Scissors, Calendar, Clock, User, ShieldCheck, MessageCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function WelcomePage({ onIniciarSesion, onRegistrarse }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fade-in space-y-12">
      {/* Sección Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
          <Scissors className="w-3.5 h-3.5 rotate-45" />
          <span>Barbería Profesional y Agendamiento Digital</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Tu estilo impecable, tu turno reservado en <span className="text-amber-400">segundos</span>.
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Agenda tus citas con los mejores barberos, elige múltiples servicios personalizados y recibe notificaciones
          automáticas por correo electrónico, WhatsApp y Telegram.
        </p>

        {/* Botones de acción principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onIniciarSesion}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-base"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRegistrarse}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-base"
          >
            <span>Crear Cuenta Nueva</span>
          </button>
        </div>

        {/* Indicadores clave */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Disponibilidad</p>
              <p className="text-sm font-bold text-white">Turnos cada 15 min</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Alertas en vivo</p>
              <p className="text-sm font-bold text-white">Email, WhatsApp y Telegram</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Garantía de servicio</p>
              <p className="text-sm font-bold text-white">Sin esperas ni solapes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Beneficios y Servicios */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Experiencia de Agendamiento Simplificada
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Diseñado para que reserves tu corte o arreglo en solo 4 pasos sin complicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">1. Elige tu Barbero</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Selecciona al profesional de tu preferencia para conocer su disponibilidad exacta en agenda.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">2. Servicios a tu Medida</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Corte clásico, degradados, barba spa o combos. Puedes elegir uno o varios para una misma cita.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">3. Fecha y Franja</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Consulta los turnos disponibles por mañana, tarde o noche con cálculo de duración en tiempo real.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">4. Confirmación Rápida</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Recibe tu código de reserva único, detalles del costo y opción para compartir en WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Invitación Final */}
      <section className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-slate-950/50">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          ¿Listo para reservar tu próximo corte?
        </h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Inicia sesión con tu correo o crea tu cuenta gratuita para acceder a tu historial de citas y gestionar tus turnos.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onIniciarSesion}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md shadow-amber-500/20 text-sm"
          >
            Ingresar al Sistema
          </button>
          <button
            type="button"
            onClick={onRegistrarse}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl transition text-sm"
          >
            Registrarme como Cliente
          </button>
        </div>
      </section>
    </div>
  );
}

