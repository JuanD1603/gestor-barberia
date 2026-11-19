import React, { useState, useEffect, useCallback } from 'react';
import { Scissors, User, Calendar as CalendarIcon, Clock, Check, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import CatalogoCortesProductos from './CatalogoCortesProductos';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import {
  INTERVALO_MINUTOS,
  TEXTOS_POLITICAS,
  formatearFecha,
  formatearHora,
  formatearPrecio,
  hoyColombia,
  sumarDias,
} from '../formato';
import Alerta from './Alerta';

export default function BookingWizard({ onBookingSuccess, onVerMisCitas }) {
  const { usuario } = useAuth();

  const [step, setStep] = useState(1);
  // Tab activa dentro del paso 2: 'servicios' o 'catalogo'
  const [tabPaso2, setTabPaso2] = useState('servicios');
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');
  const [resumen, setResumen] = useState(null); // { servicios, total, duracion_total_minutos } calculado por el backend
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [errorResumen, setErrorResumen] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState('');
  const [recargaSlots, setRecargaSlots] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [limiteAlcanzado, setLimiteAlcanzado] = useState(false);

  // Estado del formulario de reserva
  const [serviciosIds, setServiciosIds] = useState([]);
  const [selectedBarbero, setSelectedBarbero] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => sumarDias(hoyColombia(), 1));
  // Franja fija "Todo": muestra todos los turnos del día sin filtrar por mañana/tarde/noche
  const franja = 'Todo';
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notas, setNotas] = useState('');

  // Servicios y barberos activos (RF-13, RF-14)
  const cargarCatalogo = useCallback(async () => {
    setLoadingCatalogo(true);
    setErrorCatalogo('');
    try {
      const [listaServicios, listaBarberos] = await Promise.all([api.servicios(), api.barberos()]);
      setServicios(listaServicios);
      setBarberos(listaBarberos);
      return listaServicios;
    } catch (err) {
      setErrorCatalogo(err.message);
      return null;
    } finally {
      setLoadingCatalogo(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  // Total y duración de los servicios elegidos: los calcula el backend (RF-15)
  useEffect(() => {
    if (serviciosIds.length === 0) {
      setResumen(null);
      setErrorResumen('');
      return undefined;
    }
    let activo = true;
    setLoadingResumen(true);
    setErrorResumen('');
    api
      .resumenCita(serviciosIds)
      .then((data) => activo && setResumen(data))
      .catch(async (err) => {
        if (!activo) return;
        setErrorResumen(err.message);
        if (err.status === 404) {
          // Un servicio dejó de estar disponible: se actualiza el catálogo y se descarta la selección.
          setServiciosIds([]);
          await cargarCatalogo();
        }
      })
      .finally(() => activo && setLoadingResumen(false));
    return () => {
      activo = false;
    };
  }, [serviciosIds, cargarCatalogo]);

  // Horarios libres del barbero para la fecha y duración total (RF-18). Solo se piden en el paso 3.
  // La franja es siempre "Todo" para mostrar todos los turnos disponibles del día.
  useEffect(() => {
    if (step !== 3) return undefined;
    setSelectedSlot(null);
    setErrorSlots('');
    if (!selectedBarbero || !selectedDate || serviciosIds.length === 0) {
      setSlots([]);
      return undefined;
    }
    let activo = true;
    setLoadingSlots(true);
    api
      .disponibilidad({ barberoId: selectedBarbero.id, fecha: selectedDate, franja, serviciosIds })
      .then((data) => activo && setSlots(data))
      .catch((err) => {
        if (!activo) return;
        setSlots([]);
        setErrorSlots(err.message);
      })
      .finally(() => activo && setLoadingSlots(false));
    return () => {
      activo = false;
    };
  }, [step, selectedBarbero, selectedDate, franja, serviciosIds, recargaSlots]);

  const alternarServicio = (id) => {
    setErrorMessage('');
    setServiciosIds((actuales) => (actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]));
  };

  const reiniciar = () => {
    setStep(1);
    setServiciosIds([]);
    setSelectedBarbero(null);
    setSelectedSlot(null);
    setNotas('');
    setLimiteAlcanzado(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLimiteAlcanzado(false);
    setSubmitting(true);

    try {
      const cita = await api.crearCita({
        barbero_id: selectedBarbero.id,
        servicios_ids: serviciosIds,
        fecha: selectedDate,
        hora_inicio: selectedSlot.hora_inicio,
        notas: notas.trim() || null,
      });
      // Éxito: notificar al padre para abrir el modal y reiniciar el asistente
      onBookingSuccess(cita);
      reiniciar();
    } catch (err) {
      setErrorMessage(err.message);
      if (err.status === 409) {
        if (/l[ií]mite/i.test(err.message)) {
          // Límite de citas programadas (CA-19.2): no se resuelve eligiendo otro horario.
          setLimiteAlcanzado(true);
        } else {
          // Horario ocupado por otra reserva (CA-20.2): volver a elegir con la disponibilidad actualizada.
          setSelectedSlot(null);
          setStep(3);
          setRecargaSlots((n) => n + 1);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const cambiarFecha = (valor) => {
    setErrorMessage('');
    setSelectedDate(valor);
  };

  const horariosLibres = slots.filter((s) => s.disponible);
  const duracionTotal = resumen?.duracion_total_minutos;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Indicador de Pasos */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-800 -z-0" />
        {[
          { num: 1, label: 'Barbero', icon: User },
          { num: 2, label: 'Servicios', icon: Scissors },
          { num: 3, label: 'Fecha y Hora', icon: CalendarIcon },
          { num: 4, label: 'Confirmación', icon: Check },
        ].map((item) => {
          const Icon = item.icon;
          const isDone = step > item.num;
          const isCurrent = step === item.num;
          return (
            <div key={item.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Alertas de error */}
      <Alerta tipo="error" className="mb-6">{errorCatalogo}</Alerta>
      {errorMessage && (
        <Alerta tipo="error" className="mb-6">
          <p>{errorMessage}</p>
          {limiteAlcanzado && onVerMisCitas && (
            <button
              type="button"
              onClick={onVerMisCitas}
              className="mt-2 underline underline-offset-2 hover:text-rose-200 transition"
            >
              Ver mis citas
            </button>
          )}
        </Alerta>
      )}

      {/* ================= PASO 1: BARBEROS ================= */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Selecciona a tu Barbero</h2>
            <p className="text-slate-400 text-sm mt-1">Elige con quién quieres atenderte.</p>
          </div>

          {loadingCatalogo ? (
            <div className="py-12 text-center text-slate-400 text-sm">Cargando barberos...</div>
          ) : barberos.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No hay barberos disponibles por el momento.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {barberos.map((b) => {
                const selected = selectedBarbero?.id === b.id;
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => {
                      setSelectedBarbero(b);
                      setErrorMessage('');
                    }}
                    aria-pressed={selected}
                    className={`p-5 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between ${
                      selected
                        ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {b.foto_url ? (
                        <img
                          src={b.foto_url}
                          alt={b.nombre}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-700 mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 font-bold text-xl mb-3">
                          {b.nombre[0]}
                        </div>
                      )}
                      <h3 className="font-bold text-base text-white">{b.nombre}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 w-full">
                      <span className={`text-xs font-semibold ${selected ? 'text-amber-400' : 'text-slate-500'}`}>
                        {selected ? 'Seleccionado ✓' : 'Seleccionar'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              disabled={!selectedBarbero}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center gap-2"
            >
              Siguiente: Elegir Servicios <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 2: SERVICIOS + CATALOGO ================= */}
      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Selecciona tus Servicios</h2>
            <p className="text-slate-400 text-sm mt-1">
              Puedes elegir uno o varios servicios para tu cita con {selectedBarbero?.nombre}.
            </p>
          </div>

          {/* Tabs de alternancia entre servicios y catálogo */}
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tabPaso2 === 'servicios'}
              onClick={() => setTabPaso2('servicios')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                tabPaso2 === 'servicios'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Scissors className="w-4 h-4" />
              Servicios para Agendar
              {serviciosIds.length > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tabPaso2 === 'servicios'
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {serviciosIds.length}
                </span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tabPaso2 === 'catalogo'}
              onClick={() => setTabPaso2('catalogo')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                tabPaso2 === 'catalogo'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Catalogo de Inspiracion
            </button>
          </div>

          {/* Tab: Servicios para agendar */}
          {tabPaso2 === 'servicios' && (
            <>
              {loadingCatalogo ? (
                <div className="py-12 text-center text-slate-400 text-sm">Cargando servicios...</div>
              ) : servicios.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">No hay servicios disponibles por el momento.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicios.map((s) => {
                    const selected = serviciosIds.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => alternarServicio(s.id)}
                        aria-pressed={selected}
                        className={`p-5 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between text-left ${
                          selected
                            ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full gap-3">
                          <h3 className="font-bold text-lg text-white">{s.nombre}</h3>
                          <span className="text-amber-400 font-bold text-lg">{formatearPrecio(s.precio)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 w-full">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> {s.duracion_minutos} minutos
                          </span>
                          <span className={`font-semibold ${selected ? 'text-amber-400' : 'text-slate-500'}`}>
                            {selected ? 'Seleccionado' : 'Elegir'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Resumen calculado por el backend (RF-15) */}
              <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <Alerta tipo="error" className="mb-3">{errorResumen}</Alerta>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-slate-400">
                    {serviciosIds.length === 0
                      ? 'Elige al menos un servicio para continuar.'
                      : `${serviciosIds.length} ${serviciosIds.length === 1 ? 'servicio elegido' : 'servicios elegidos'}`}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-400">
                      Duracion total:{' '}
                      <strong className="text-white">
                        {serviciosIds.length === 0 ? '0' : duracionTotal ?? '...'} min
                      </strong>
                    </span>
                    <span className="text-slate-400">
                      Total:{' '}
                      <strong className="text-emerald-400 text-lg">
                        {serviciosIds.length === 0 ? '$0' : resumen ? formatearPrecio(resumen.total) : '...'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab: Catalogo de inspiracion */}
          {tabPaso2 === 'catalogo' && <CatalogoCortesProductos />}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Barbero
            </button>
            <button
              disabled={serviciosIds.length === 0 || !resumen || loadingResumen}
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center gap-2"
            >
              Siguiente: Fecha y Turno <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 3: FECHA Y HORARIOS ================= */}
      {step === 3 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Fecha y Horario</h2>
            <p className="text-slate-400 text-sm mt-1">
              Todos los turnos disponibles con {selectedBarbero?.nombre} se muestran por horario ({duracionTotal} min por cita, cada {INTERVALO_MINUTOS} min).
            </p>
          </div>

          {/* Selector de fecha */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <label htmlFor="cita-fecha" className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Seleccionar Fecha
            </label>
            <input
              id="cita-fecha"
              type="date"
              value={selectedDate}
              min={hoyColombia()}
              onChange={(e) => cambiarFecha(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Turnos disponibles — se cargan automáticamente al entrar al paso */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-sm text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Turnos disponibles el {formatearFecha(selectedDate)}
            </h3>

            {errorSlots && <Alerta tipo="error" className="mb-4">{errorSlots}</Alerta>}

            {loadingSlots ? (
              <div className="py-8 text-center text-slate-400 text-sm">Consultando disponibilidad en tiempo real...</div>
            ) : horariosLibres.length === 0 ? (
              !errorSlots && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No hay horarios disponibles para esta fecha. Prueba con otro dia.
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {horariosLibres.map((s) => {
                  const isSelected = selectedSlot?.hora_inicio === s.hora_inicio;
                  return (
                    <button
                      type="button"
                      key={s.hora_inicio}
                      onClick={() => {
                        setSelectedSlot(s);
                        setErrorMessage('');
                      }}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-semibold">{formatearHora(s.hora_inicio)}</span>
                      <span className="text-[10px] opacity-70">a {formatearHora(s.hora_fin)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Servicios
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center gap-2"
            >
              Siguiente: Confirmar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 4: CONFIRMACIÓN ================= */}
      {step === 4 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Confirmar Reserva</h2>
            <p className="text-slate-400 text-sm mt-1">Revisa el resumen y confirma tu cita.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumen de la Cita */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit">
              <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Resumen de Reserva
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Servicios:</span>
                  <ul className="mt-0.5 space-y-1">
                    {(resumen?.servicios || []).map((s) => (
                      <li key={s.id} className="flex justify-between gap-2 text-white text-sm font-semibold">
                        <span>{s.nombre}</span>
                        <span className="text-slate-300 font-normal">{formatearPrecio(s.precio)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-400">Barbero:</span>
                  <p className="font-semibold text-white text-sm mt-0.5">{selectedBarbero?.nombre}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fecha y Hora:</span>
                  <p className="font-semibold text-amber-400 text-sm mt-0.5">
                    {formatearFecha(selectedDate)} ({formatearHora(selectedSlot?.hora_inicio)} — {formatearHora(selectedSlot?.hora_fin)})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Duración total:</span>
                  <p className="font-semibold text-white text-sm mt-0.5">{duracionTotal} minutos</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total a Pagar:</span>
                  <span className="font-bold text-lg text-emerald-400">{formatearPrecio(resumen?.total)}</span>
                </div>
              </div>
            </div>

            {/* Confirmación */}
            <form onSubmit={handleSubmit} className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="text-sm text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                Reservando como <strong className="text-white">{usuario?.nombre}</strong>
                <span className="text-slate-400"> ({usuario?.email})</span>
              </div>

              <div>
                <label htmlFor="cita-notas" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Notas o Preferencias Especiales (opcional)
                </label>
                <textarea
                  id="cita-notas"
                  rows={2}
                  maxLength={500}
                  placeholder="Ej: Degradado bajo con navaja, poco corte arriba..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none text-sm"
                />
              </div>

              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5">
                <li>{TEXTOS_POLITICAS.anticipacion}</li>
                <li>{TEXTOS_POLITICAS.reprogramacion}</li>
                <li>{TEXTOS_POLITICAS.limite}</li>
                <li>{TEXTOS_POLITICAS.pago}</li>
              </ul>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Modificar Horario
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  {submitting ? 'Confirmando...' : 'Confirmar y Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
