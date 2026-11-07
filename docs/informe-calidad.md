# 📋 Informe de Calidad, Defectos y Mantenimiento

**Proyecto:** BarberShop Pro — Sistema de Gestión y Agendamiento de Barbería  
**Materia:** Ingeniería de Software II (Código 17934) — Cotecnova  
**Docente:** Felipe Gutiérrez Isaza  
**Responsable de Calidad:** Juan David Osorio  
**Responsable de Pruebas:** Sebastian Orozco  
**Líder Técnico:** Elizabeth Ramirez  
**Documentación:** Juan David Monroy  
**Versión del Documento:** 2.0 (Seguimiento 2 — Versión 1.1 del Sistema)

---

## 1. Resumen Ejecutivo de Calidad (Seguimiento 2)

Durante la transición de la Versión 1.0 a la Versión 1.1, el sistema experimentó una evolución arquitectónica mayor: se implementó control de acceso basado en roles (**RBAC** con Cliente, Barbero y Administrador), hashing criptográfico de contraseñas con **Argon2id**, un motor de notificaciones por correo electrónico y políticas de penalización por inasistencia.

Desde el área de **Aseguramiento de Calidad (QA)**, se lideró una auditoría exhaustiva del nuevo código mediante pruebas de regresión, detección temprana de defectos en la configuración y refactorización de suites de prueba legadas, alcanzando una cobertura de **283 casos de prueba automatizados con 100% de efectividad**.

---

## 2. Métricas Comparativas de Calidad (Seguimiento 1 vs. Seguimiento 2)

| Métrica de Calidad | Seguimiento 1 (v1.0) | Seguimiento 2 (v1.1) | Evolución / Estado |
|---|---|---|---|
| **Casos de prueba automatizados** | 9 pruebas | **283 pruebas** | 🚀 +3,044% de cobertura |
| **Suites de prueba modulares** | 1 archivo (`test_citas.py`) | **9 archivos especializados** | ✅ Alta cohesión modular |
| **Tasa de éxito en ejecución** | 100% (9 de 9) | **100% (283 de 283)** | ✅ 0 pruebas fallidas |
| **Seguridad de contraseñas** | N/A (sin auth) | **Argon2id** (OWASP Recomendado) | 🛡️ Máxima seguridad |
| **Control de acceso (RBAC)** | Rutas públicas | Autenticación con Token Bearer | 🛡️ Rutas Admin/Barbero protegidas |
| **Tiempo de respuesta bajo carga** | Pruebas simples | < 500 ms con 500 citas y 20 hilos | ⚡ RNF-08 Verificado |
| **Integridad de configuración Git** | 0 credenciales | `.env.example` auditado sin datos | ✅ Criterio Ética superado |

---

## 3. Registro y Gestión de Defectos (Bugs)

*(Historial completo de defectos detectados, reproducidos y corregidos durante el ciclo de vida del proyecto).*

### 🐛 Defecto DEF-001: Falso positivo de solapamiento en citas consecutivas
* **Etapa:** Seguimiento 1 (v1.0)
* **Severidad:** Alta
* **Módulo afectado:** `src/backend/services.py` (`hay_solapamiento`)
* **Descripción:** Si una cita terminaba a las 10:30 y otra comenzaba exactamente a las 10:30, el algoritmo bloqueaba erróneamente la segunda cita con `HTTP 409 Conflict`.
* **Causa raíz:** Operador de comparación inclusiva en intervalos semiabiertos $[A, B)$.
* **Solución aplicada:** Corrección de la fórmula a $\max(\text{Inicio}_A, \text{Inicio}_B) < \min(\text{Fin}_A, \text{Fin}_B)$.
* **Verificación:** `test_cp05_agendar_citas_consecutivas_permitidas` en `test_citas.py`.

---

### 🐛 Defecto DEF-002: Inyección de datos numéricos anómalos en el catálogo
* **Etapa:** Seguimiento 1 (v1.0)
* **Severidad:** Media
* **Módulo afectado:** `src/backend/schemas.py` (`ServicioCreate`)
* **Descripción:** Se permitía enviar servicios con duración $\le 0$ o precios negativos.
* **Solución aplicada:** Validadores estrictos Pydantic v2 (`duracion_minutos > 0`, `precio >= 0`).
* **Verificación:** `test_cp02` y `test_cp03`.

---

### 🐛 Defecto DEF-003: Modificación indebida de citas finalizadas
* **Etapa:** Seguimiento 1 (v1.0)
* **Severidad:** Media
* **Módulo afectado:** `src/backend/main.py`
* **Descripción:** Una cita en estado `Finalizada` permitía retroceder a `Pendiente`.
* **Solución aplicada:** Guarda de estado terminal que responde `HTTP 400 Bad Request`.
* **Verificación:** `test_cp09`.

---

### 🐛 Defecto DEF-004: Fuga de configuración SMTP predeterminada en plantilla pública
* **Etapa:** Seguimiento 2 (v1.1)
* **Severidad:** Media (Riesgo de Seguridad y Configuración)
* **Módulo afectado:** `src/backend/.env.example`
* **Descripción del problema:** La plantilla de variables de entorno incluía `SMTP_HOST=smtp.gmail.com` preconfigurado. Esto violaba la política de pruebas donde ningún host de correo externo debe estar predefinido para evitar envíos involuntarios o asunciones de infraestructura en entornos de prueba.
* **Causa raíz:** Asignación de un proveedor específico en lugar de un valor vacío.
* **Solución aplicada:** Se sanitizó `src/backend/.env.example` estableciendo `SMTP_HOST=` vacío por defecto.
* **Verificación:** `test_env_example_declara_las_variables_smtp_sin_credenciales` en `tests/test_notificaciones.py`.

---

### 🐛 Defecto DEF-005: Regresión en endpoints legados de servicios por desacoplamiento RBAC
* **Etapa:** Seguimiento 2 (v1.1)
* **Severidad:** Alta (Regresión de Software)
* **Módulo afectado:** `tests/test_citas.py` vs `src/backend/main.py`
* **Descripción del problema:** Tras proteger las operaciones de creación y eliminación de servicios con el rol de Administrador, la ruta `POST /api/servicios` fue eliminada en favor de `POST /api/admin/servicios`. Los tests legados del Seguimiento 1 comenzaron a fallar con error `HTTP 405 Method Not Allowed`.
* **Causa raíz:** Falta de adaptación de los tests de caja negra frente al cambio de arquitectura de seguridad (RBAC).
* **Solución aplicada:** Se aplicó **mantenimiento correctivo** a la suite `test_citas.py`, inyectando las cabeceras de autorización `h_admin` y apuntando a los nuevos endpoints protegidos.
* **Verificación:** Ejecución limpia de `tests/test_citas.py` con 9 de 9 pruebas pasando.

---

### 🐛 Defecto DEF-006: Discrepancia de formato en serialización de horas en base de datos SQLite
* **Etapa:** Seguimiento 2 (v1.1)
* **Severidad:** Baja (Consistencia de Datos)
* **Módulo afectado:** `tests/test_citas.py`
* **Descripción del problema:** Las pruebas asumían que la respuesta JSON de las horas tenía formato `HH:MM` (ej: `10:00`), pero el driver de persistencia retornaba formato extendido con segundos `HH:MM:SS` (ej: `10:00:00`), produciendo fallas de aserción.
* **Solución aplicada:** Uso de validación con prefijo (`.startswith("10:00")`) tolerante a segundos.

---

## 4. Acciones de Mantenimiento de Software (Clasificación ISO/IEC 14764)

Para dar cumplimiento formal al criterio de **Mantenimiento** evaluado en la Clase 9, se documentan las cuatro categorías de mantenimiento aplicadas al sistema:

### 1. Mantenimiento Correctivo
* Reparación de los defectos `DEF-001` (solapamiento), `DEF-004` (configuración SMTP), `DEF-005` (regresión de endpoints protegidos) y `DEF-006` (formato de horas).
* Corrección de aserciones de tolerancia temporal en `tests/test_agendamiento.py` para absorber la variabilidad de I/O en sistemas operativos Windows.

### 2. Mantenimiento Adaptativo
* Adaptación del modelo relacional para soportar cuentas con roles diferenciados (`Usuario` con roles `ADMIN`, `BARBERO`, `CLIENTE`).
* Integración del estándar **Argon2id** (`argon2-cffi`) para el almacenamiento seguro de credenciales con salting automático.
* Incorporación de soporte para plantillas HTML de correo y despacho asíncrono en segundo plano (`BackgroundTasks`).

### 3. Mantenimiento Perfectivo
* Optimización del algoritmo de disponibilidad (`/api/disponibilidad`) para filtrar citas previas directamente en la base de datos antes de calcular los slots en memoria, permitiendo atender 20 consultas concurrentes con 500 citas en menos de 500 ms.
* Creación de un panel de administración en React (`AdminPanel.jsx`) con filtros en tiempo real y vista unificada de ingresos y turnos.

### 4. Mantenimiento Preventivo
* **Suite de no-regresión de 283 pruebas unitarias e integración:** Antes de cada despliegue o fusión de ramas, se corre `pytest tests/` para asegurar que las nuevas funcionalidades no rompan la lógica ya construida.
* Verificación continua de sanitización del repositorio mediante `.gitignore` estricto y archivos de plantilla `.env.example`.
