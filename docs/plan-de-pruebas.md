# 🧪 Plan de Pruebas de Software (Seguimiento 1)

**Proyecto:** BarberShop Pro — Sistema de Gestión y Agendamiento de Barbería  
**Materia:** Ingeniería de Software II (Código 17934) — Cotecnova  
**Responsable de Pruebas:** Sebastian Orozco  
**Responsable de Calidad:** Juan David Osorio  
**Líder Técnico:** Elizabeth Ramirez  
**Documentación:** Juan David Monroy  

---

## 1. Propósito y Alcance de las Pruebas

Este documento establece la estrategia y el diseño formal de casos de prueba para verificar los módulos centrales desarrollados en el **Seguimiento 1**:
1. Validación de entradas en el catálogo de servicios (precios, duraciones).
2. Cálculo automático de horarios de cita (`hora_fin = hora_inicio + duracion_minutos`).
3. Detección y prevención estricta de choques de horario (**RF-04**) para un mismo barbero.
4. Integridad referencial e independencia entre agendas de diferentes barberos.
5. Control de estados operativos y bloqueo de modificaciones sobre citas finalizadas.

---

## 2. Técnicas de Diseño de Pruebas Aplicadas

Siguiendo las metodologías vistas en clase, se aplicaron dos técnicas de caja negra formales:

### A. Partición de Equivalencia (Equivalence Partitioning)
Se dividió el dominio de entrada en clases válidas e inválidas para probar comportamientos representativos sin redundancia:

| Variable / Campo | Clase Válida | Clases Inválidas |
|---|---|---|
| **Duración del servicio** | Entero entre $1$ y $240$ minutos ($>0$) | $\le 0$ minutos (ej. $0, -15$), $> 240$ min, o no numérico |
| **Precio del servicio** | Decimal mayor o igual a $0.00$ | Decimal negativo (ej. $-5.00$, $-0.01$) |
| **Estado de la cita** | `'Pendiente'`, `'En curso'`, `'Finalizada'`, `'Cancelada'` | Cualquier cadena arbitraria (ej. `'Borrador'`, `'Esperando'`) |
| **Horario del Barbero** | Turno en franja sin citas activas | Turno que interseca con una cita activa existente |

### B. Análisis de Valores Límite (Boundary Value Analysis - BVA)
Se probaron las fronteras críticas del algoritmo de solapamiento de tiempo para evitar falsos positivos o falsos negativos:

```text
Caso Cita Existente: [10:00 ---------------- 10:30)

Caso Límite Válido (Contiguo):            [10:30 -------- 11:00) -> APROBADO (HTTP 201)
Caso Límite Inválido (Solape 1 min):   [10:29 -------- 10:59) -> CONFLICTO (HTTP 409)
Caso Interior Inválido:                  [10:10 --- 10:25)       -> CONFLICTO (HTTP 409)
```

---

## 3. Matriz Detallada de Casos de Prueba (CP)

| ID | Requisito | Técnica | Condición / Entrada | Resultado Esperado | Código HTTP |
|---|---|---|---|---|---|
| **CP-01** | RF-02 | Partición Válida | Crear servicio con nombre "Corte", duración 30 min, precio $15.00 | Servicio persistido en BD | `201 Created` |
| **CP-02** | RF-02 | Partición Inválida | Crear servicio con precio negativo ($-5.00$) | Error de validación Pydantic | `422 Unprocessable` |
| **CP-03** | RF-02 | Valores Límite | Crear servicio con duración $0$ minutos | Error de validación Pydantic (`gt=0`) | `422 Unprocessable` |
| **CP-04** | RF-03 | Partición Válida | Agendar cita para Barbero 1 de 09:00 a 09:30 en horario libre | Cita agendada, código `BSP-...` generado, hora fin 09:30 | `201 Created` |
| **CP-05** | RF-04 | Valor Límite Frontera | Agendar cita con inicio exactamente a la hora fin de la anterior (10:30 tras cita de 10:00 a 10:30) | Permitido. Citas contiguas no colisionan | `201 Created` |
| **CP-06** | RF-04 | Valor Límite Frontera | Agendar cita con solape de 1 minuto (10:29 cuando hay cita hasta 10:30) | Rechazado por choque de horario | `409 Conflict` |
| **CP-07** | RF-04 | Partición Inválida | Agendar cita totalmente contenida dentro de otra existente (10:05 a 10:25) | Rechazado por choque de horario | `409 Conflict` |
| **CP-08** | RF-04 | Independencia de Datos | Agendar a las 10:00 con Barbero 2 cuando Barbero 1 ya está ocupado a las 10:00 | Permitido. Cada profesional tiene agenda independiente | `201 Created` |
| **CP-09** | RF-06 | Máquina de Estados | Intentar cambiar el estado de una cita ya marcada como `Finalizada` | Rechazado por regla de negocio de estado terminal | `400 Bad Request` |

---

## 4. Automatización con Pytest

* **Framework:** `pytest` con `httpx.AsyncClient` y `TestClient` de FastAPI.
* **Aislamiento:** Base de datos SQLite en memoria (`sqlite:///:memory:`) para que las pruebas corran en milisegundos y sean reproducibles en cualquier máquina sin tocar datos reales.
* **Comando de ejecución:**
  ```bash
  pytest tests/ -v
  ```
