# Especificación Formal de Requisitos del Sistema e Historias de Usuario (BDD / Gherkin)
## Proyecto: BarberShop Pro 💈✂️

**Materia:** Ingeniería de Software II (Código 17934) — Cotecnova  
**Responsable de Documentación y Requisitos:** Juan David Monroy  
**Líder Técnico:** Elizabeth Ramirez  
**Responsable de Calidad:** Juan David Osorio  
**Responsable de Pruebas:** Sebastian Orozco  
**Versión:** 1.0 (Seguimiento 1)  
**Estado:** Aprobado / Backend Core Implementado y Verificado  

---

## 1. Introducción y Alcance del Sistema

El presente documento constituye la especificación formal de requisitos de software y las historias de usuario bajo el enfoque **Behavior-Driven Development (BDD)** para la plataforma **BarberShop Pro**. 

El sistema tiene como objetivo centralizar, automatizar y optimizar la administración de turnos y servicios de barbería, garantizando la eliminación absoluta de dobles reservas (*overbooking*), la transparencia de la disponibilidad en tiempo real para los clientes y la trazabilidad del estado de cada atención mediante identificadores únicos de reserva con prefijo `BSP-`.

### 1.1 Actores del Sistema

- **Cliente**: Usuario final que consulta servicios, barberos disponibles, franjas horarias libres y formaliza reservas de citas recibiendo un código único institucional.
- **Barbero**: Profesional del equipo que presta los servicios y actualiza el ciclo de vida de la cita (`Pendiente` -> `En curso` -> `Finalizada` o `Cancelada`).
- **Administrador**: Encargado del mantenimiento de la plataforma, alta y configuración de barberos y definición del catálogo de servicios (precios y duraciones).

---

## 2. Requisitos Funcionales (RF)

| ID | Requisito Funcional | Prioridad | Descripción y Reglas de Negocio | Endpoint / Componente |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Catálogo de Servicios | **Alta (Must Have)** | El sistema debe permitir consultar y dar de alta servicios con nombre, descripción, duración en minutos y precio unitario. La duración debe ser mayor a 0 y hasta 240 min. El precio no puede ser negativo ($\ge 0$). | `GET /api/servicios`<br>`POST /api/servicios` |
| **RF-02** | Catálogo de Barberos | **Alta (Must Have)** | El sistema debe permitir registrar y listar barberos con nombre, especialidad técnica, correo electrónico institucional único y teléfono. Se permite filtrar solo barberos activos. | `GET /api/barberos`<br>`POST /api/barberos` |
| **RF-03** | Agendamiento y Creación de Citas | **Crítica (Must Have)** | El cliente podrá reservar un turno indicando barbero, servicio, fecha y hora de inicio deseada. El sistema calcula automáticamente la hora de fin y genera un código alfanumérico único con prefijo `BSP-XXXXXX`. | `POST /api/citas` |
| **RF-04** | Detección Matemática de Colisiones | **Crítica (Must Have)** | El sistema debe impedir cualquier choque de horarios para el mismo barbero en la misma fecha. La regla matemática determina que dos intervalos $[I_A, F_A)$ e $[I_B, F_B)$ chocan si $\max(I_A, I_B) < \min(F_A, F_B)$. Las citas consecutivas ($F_A = I_B$) sí son permitidas. | `services.verificar_disponibilidad_barbero` |
| **RF-05** | Cálculo Dinámico de Franjas Disponibles | **Alta (Must Have)** | El sistema debe generar slots cada 30 minutos dentro del horario comercial (09:00 a 20:00) evaluando si cabe la duración del servicio y marcando cada franja como disponible o no según las citas activas. | `GET /api/disponibilidad` |
| **RF-06** | Ciclo de Vida y Transición de Estados | **Media (Should Have)** | Las citas gestionan 4 estados: `Pendiente`, `En curso`, `Finalizada`, `Cancelada`. Una cita `Cancelada` libera el turno para nuevas reservas. Una cita `Finalizada` es inmutable. | `PATCH /api/citas/{id}/estado` |
| **RF-07** | Búsqueda por Código de Reserva | **Alta (Must Have)** | Los clientes y el personal pueden buscar de forma directa los detalles de una cita utilizando su código institucional (ej: `BSP-3DF82A`). | `GET /api/citas/codigo/{codigo}` |
| **RF-08** | Filtrado y Auditoría de Citas | **Media (Should Have)** | La plataforma debe permitir listar y filtrar citas por fecha específica, por barbero y por estado actual de atención, ordenadas cronológicamente por hora de inicio. | `GET /api/citas` |

---

## 3. Requisitos No Funcionales (RNF)

### RNF-01: Integridad Referencial y Persistencia ACID
- **Definición**: Toda cita debe estar asociada obligatoriamente a un barbero existente y a un servicio válido mediante claves foráneas relacionales (`ForeignKey`).
- **Política de Protección**: Se aplica la directiva `ondelete="RESTRICT"`, impidiendo la eliminación física accidental de un barbero o servicio que posea citas históricas registradas.

### RNF-02: Rendimiento y Concurrencia Asíncrona
- **Definición**: El backend desarrollado en FastAPI sobre ASGI Uvicorn debe procesar las consultas de disponibilidad y agendamiento en un tiempo de respuesta inferior a 200 ms bajo condiciones normales de carga.

### RNF-03: Validación Rigurosa de Datos (Fail-Fast)
- **Definición**: Los esquemas de entrada utilizan Pydantic v2 con validadores estrictos (`field_validator`):
  - No se permiten cadenas vacías ni con puros espacios en blanco.
  - El correo debe cumplir con formato RFC válido (`EmailStr`).
  - Precios de servicios $\ge 0.00$.
  - Duración en minutos $> 0$ y $\le 240$.

### RNF-04: Arquitectura Desacoplada y Política CORS
- **Definición**: La API expone servicios REST independientes del cliente web. Se implementa `CORSMiddleware` configurable por variable de entorno para admitir orígenes específicos (e.g., `http://localhost:5173` para React Vite) o comodín de desarrollo.

### RNF-05: Seguridad y Cero Secretos en Repositorio
- **Definición**: Cumplimiento de la política institucional de seguridad: ningún secreto, clave privada, credencial de base de datos ni archivo `.env` o base SQLite (`*.db`) debe ser versionado en el control de versiones Git.

### RNF-06: Portabilidad de Persistencia (SQLite / MySQL)
- **Definición**: La capa ORM de SQLAlchemy 2.0 desacopla el dialecto de base de datos, permitiendo ejecutar localmente con SQLite sin instalaciones adicionales o cambiar a MySQL / MariaDB en producción mediante la variable de entorno `DATABASE_URL`.

---

## 4. Historias de Usuario con Criterios de Aceptación Gherkin

### HU-01: Visualización del Catálogo de Servicios
**Como** cliente de la barbería  
**Quiero** ver la lista de servicios disponibles con sus descripciones, tiempos de duración y precios  
**Para** elegir el servicio que mejor se adapte a mis necesidades de estilo y presupuesto.

```gherkin
Característica: Consulta del catálogo de servicios

  Escenario: Visualizar catálogo de servicios activos exitosamente
    Dado que el sistema tiene servicios registrados y activos en la base de datos
    Cuando el usuario solicita la lista de servicios al endpoint "GET /api/servicios" con "solo_activos=true"
    Entonces el sistema responde con código HTTP 200 OK
    Y devuelve una lista con los servicios disponibles mostrando nombre, descripción, duración en minutos y precio
    Y ningún servicio inactivo es retornado en la respuesta

  Escenario: El catálogo no contiene servicios activos
    Dado que no hay servicios activos configurados en el sistema
    Cuando el usuario consulta el endpoint "GET /api/servicios"
    Entonces el sistema responde con código HTTP 200 OK
    Y devuelve una lista vacía "[]"
```

---

### HU-02: Consulta de Barberos y Especialidades
**Como** cliente de la barbería  
**Quiero** consultar los barberos que trabajan en el establecimiento y sus especialidades técnicas  
**Para** seleccionar al profesional de mi preferencia para mi corte o arreglo de barba.

```gherkin
Característica: Consulta de profesionales barberos

  Escenario: Obtener listado de barberos activos
    Dado que existen barberos registrados en el establecimiento con estado activo
    Cuando el usuario invoca el endpoint "GET /api/barberos"
    Entonces el sistema retorna un código HTTP 200 OK
    Y la respuesta incluye el ID, nombre completo, especialidad, teléfono y correo de cada barbero activo

  Escenario: Filtrado de barberos inactivos
    Dado que un barbero se encuentra con la propiedad "activo = false" por incapacidad o vacaciones
    Cuando se consulta la ruta "GET /api/barberos?solo_activos=true"
    Entonces dicho barbero no debe aparecer listado en el resultado devuelto al cliente
```

---

### HU-03: Consulta Dinámica de Turnos y Franjas Horarias Disponibles
**Como** cliente de la barbería  
**Quiero** consultar los horarios disponibles de un barbero en una fecha determinada  
**Para** seleccionar una hora libre en la que el barbero pueda atenderme sin esperas.

```gherkin
Característica: Generación dinámica de franjas horarias (Slots)

  Escenario: Consultar disponibilidad en un día con franjas libres
    Dado que el barbero con ID 1 atiende en el horario de 09:00 a 20:00
    Y el cliente selecciona un servicio con duración de 30 minutos
    Cuando el cliente consulta "GET /api/disponibilidad" con "barbero_id=1", "fecha=2026-11-10" y "servicio_id=1"
    Entonces el sistema responde con código HTTP 200 OK
    Y devuelve una lista de intervalos de tiempo con campos "hora_inicio", "hora_fin", "disponible" y "motivo"
    Y los turnos que no colisionan con citas previas tienen "disponible = true"

  Escenario: Detección de turno ocupado por cita preexistente
    Dado que el barbero con ID 1 ya tiene una cita activa de 10:00 a 10:30 en la fecha "2026-11-10"
    Cuando se consulta la disponibilidad para esa fecha
    Entonces el slot de "10:00" a "10:30" retorna "disponible = false"
    Y el campo "motivo" indica "Ocupado"
```

---

### HU-04: Agendamiento y Confirmación de Cita con Código Único
**Como** cliente del salón  
**Quiero** formalizar la reserva de una cita suministrando mis datos de contacto, barbero, servicio y hora  
**Para** asegurar mi atención en el salón y recibir un código de confirmación de reserva.

```gherkin
Característica: Reserva y confirmación de citas

  Escenario: Agendamiento exitoso de una cita en horario libre
    Dado que el barbero con ID 1 y el servicio con ID 2 están activos
    Y el horario solicitado de "14:00" para la fecha "2026-11-15" no presenta colisiones
    Cuando el cliente envía una petición "POST /api/citas" con los siguientes datos:
      | barbero_id        | 1                   |
      | servicio_id       | 2                   |
      | cliente_nombre    | "Andrés Pérez"      |
      | cliente_telefono  | "3001234567"        |
      | cliente_email     | "andres@correo.com" |
      | fecha             | "2026-11-15"        |
      | hora_inicio       | "14:00"             |
    Entonces el sistema responde con código HTTP 201 Created
    Y la cita queda almacenada con estado "Pendiente"
    Y la respuesta contiene un código de reserva único con prefijo "BSP-" (ej: "BSP-XXXXXX")
    Y la hora de fin se calcula automáticamente sumando los minutos de duración del servicio

  Escenario: Conflicto de horario por solapamiento (Overbooking)
    Dado que el barbero ya tiene agendada una cita de "14:00" a "14:45" en la fecha "2026-11-15"
    Cuando otro cliente intenta reservar al mismo barbero a las "14:15" en la misma fecha
    Entonces el sistema rechaza la solicitud con código HTTP 409 Conflict
    Y devuelve un mensaje descriptivo: "Conflicto de horario: El barbero ya tiene una cita reservada que se cruza con este horario."

  Escenario: Intento de reserva con datos incompletos o vacíos
    Dado que un cliente envía una solicitud "POST /api/citas" con el campo "cliente_nombre" compuesto únicamente de espacios en blanco
    Cuando la solicitud es recibida por la API
    Entonces el validador de Pydantic intercepta la petición
    Y responde con código HTTP 422 Unprocessable Entity indicando el error de validación
```

---

### HU-05: Búsqueda y Trazabilidad de Cita por Código de Reserva
**Como** cliente o recepcionista  
**Quiero** ingresar el código de reserva de 6 caracteres  
**Para** visualizar los detalles completos de la cita, servicio contratado y su estado actual.

```gherkin
Característica: Búsqueda de cita por identificador alfanumérico

  Escenario: Consulta exitosa de una cita existente
    Dado que existe una reserva registrada con código "BSP-A7D8F2"
    Cuando se solicita "GET /api/citas/codigo/BSP-A7D8F2"
    Entonces el sistema responde con código HTTP 200 OK
    Y retorna el detalle completo con nombre del cliente, datos del barbero, servicio, fecha, horarios y estado

  Escenario: Búsqueda de un código inexistente o inválido
    Dado que no existe ninguna reserva registrada con el código "BSP-999999"
    Cuando se consulta "GET /api/citas/codigo/BSP-999999"
    Entonces el sistema responde con código HTTP 404 Not Found
    Y el cuerpo del error detalla: "No se encontró ninguna cita con el código 'BSP-999999'."
```

---

### HU-06: Actualización del Estado de Atención de la Cita
**Como** barbero o recepcionista  
**Quiero** actualizar el estado de una cita a "En curso", "Finalizada" o "Cancelada"  
**Para** reflejar en tiempo real el avance de la jornada y liberar turnos cancelados.

```gherkin
Característica: Transición del ciclo de vida de la cita

  Escenario: Iniciar atención de una cita pendiente
    Dado que una cita con ID 5 tiene estado "Pendiente"
    Cuando el personal envía un "PATCH /api/citas/5/estado" con body '{"estado": "En curso"}'
    Entonces el sistema responde con código HTTP 200 OK
    Y el estado de la cita se actualiza a "En curso"

  Escenario: Cancelación de cita y liberación de disponibilidad
    Dado que una cita con ID 8 para las "16:00" es cancelada mediante '{"estado": "Cancelada"}'
    Cuando otro cliente consulta la disponibilidad para esa franja horaria
    Entonces la franja de las "16:00" vuelve a estar marcada como "disponible = true"

  Escenario: Protección de inmutabilidad en citas finalizadas
    Dado que una cita con ID 3 ya se encuentra en estado "Finalizada"
    Cuando alguien intenta cambiar su estado a "Cancelada" o "Pendiente"
    Entonces el sistema rechaza la operación con código HTTP 400 Bad Request
    Y retorna el error: "Una cita marcada como 'Finalizada' no puede modificar su estado."
```

---

### HU-07: Registro y Alta de Nuevos Servicios
**Como** administrador del sistema  
**Quiero** dar de alta nuevos servicios en el catálogo con duración y tarifa  
**Para** ampliar la oferta comercial de la barbería.

```gherkin
Característica: Administración del catálogo de servicios

  Escenario: Registro exitoso de nuevo servicio
    Dado que el administrador desea añadir el servicio "Exfoliación Facial"
    Cuando envía "POST /api/servicios" con nombre "Exfoliación Facial", duración 45 minutos y precio 18.50
    Entonces el sistema almacena el registro y devuelve código HTTP 201 Created con el ID asignado

  Escenario: Rechazo de servicio con precio negativo
    Dado que se envía una petición con precio "-5.00"
    Cuando la API procesa el esquema de validación
    Entonces el sistema responde con código HTTP 422 Unprocessable Entity
    Y el nuevo servicio no es insertado en la base de datos
```

---

### HU-08: Registro de Barbero con Validación de Correo Único
**Como** administrador del sistema  
**Quiero** registrar a un nuevo profesional barbero en la plataforma  
**Para** asignarle turnos y ponerlo a disposición de los clientes.

```gherkin
Característica: Registro institucional de barberos

  Escenario: Registro exitoso de barbero
    Dado que no existe ningún barbero registrado con el correo "julian@barbershop.pro"
    Cuando se envía "POST /api/barberos" con los datos de Julian
    Entonces el sistema responde con código HTTP 201 Created y crea el perfil activo

  Escenario: Rechazo por correo electrónico duplicado
    Dado que ya existe un barbero registrado con el correo "mateo@barbershop.pro"
    Cuando se intenta crear otro barbero utilizando ese mismo correo electrónico
    Entonces el sistema responde con código HTTP 400 Bad Request
    Y detalla: "Ya existe un barbero registrado con el correo 'mateo@barbershop.pro'."
```

---

## 5. Matriz de Trazabilidad de Requisitos

La siguiente matriz evidencia el cumplimiento y mapeo directo entre los requisitos funcionales, las historias de usuario bajo BDD y la implementación en el código fuente:

| Requisito Funcional | Historia de Usuario | Endpoint / Módulo | Modelo ORM | Validación Pydantic | Caso de Prueba QA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** (Servicios) | **HU-01**, **HU-07** | `GET /api/servicios`<br>`POST /api/servicios` | `models.Servicio` | `ServicioCreate`, `ServicioResponse` | `CP-01`, `CP-02`, `CP-03` |
| **RF-02** (Barberos) | **HU-02**, **HU-08** | `GET /api/barberos`<br>`POST /api/barberos` | `models.Barbero` | `BarberoCreate`, `BarberoResponse` | `CP-04` |
| **RF-03** (Agendamiento) | **HU-04** | `POST /api/citas` | `models.Cita` | `CitaCreate`, `CitaResponse` | `CP-05` |
| **RF-04** (Anti-Solapamiento) | **HU-04** | `services.verificar_disponibilidad_barbero` | `models.Cita` | Lógica matemática en `services.py` | `CP-06`, `CP-07` |
| **RF-05** (Disponibilidad) | **HU-03** | `GET /api/disponibilidad` | `models.Cita` | `SlotHorario` | `CP-08` |
| **RF-06** (Transición Estados) | **HU-06** | `PATCH /api/citas/{id}/estado` | `models.Cita` | `CitaEstadoUpdate` | `CP-09` |
| **RF-07** (Búsqueda Código) | **HU-05** | `GET /api/citas/codigo/{codigo}` | `models.Cita` | `CitaResponse` | Verificación API |
| **RF-08** (Filtros de Citas) | **HU-04**, **HU-06** | `GET /api/citas` | `models.Cita` | Parámetros de Query en `main.py` | Verificación API |

---

## 6. Reglas de Negocio Institucionales (RN)

1. **RN-01 (Horario Comercial)**: Las franjas de atención regulares inician a las **09:00** y culminan a las **20:00**. Ningún servicio puede extenderse más allá de la hora de cierre.
2. **RN-02 (Citas Consecutivas Válidas)**: Si la Cita A termina exactamente a las 11:30 y la Cita B inicia a las 11:30 con el mismo barbero, el sistema las considera consecutivas y **no hay solapamiento**, maximizando la ocupación del salón.
3. **RN-03 (Liberación de Turnos Cancelados)**: Al cambiar el estado de una cita a `Cancelada`, el algoritmo de disponibilidad omite dicho registro automáticamente, reabriendo la franja horaria para nuevos clientes.
4. **RN-04 (Inmutabilidad de Auditoría)**: Al completarse un servicio y marcarse como `Finalizada`, la cita queda bloqueada contra cambios de estado posteriores para preservar la integridad financiera y de reportes.
5. **RN-05 (Identificador Amigable)**: Todo código de reserva debe tener el prefijo institucional `BSP-` seguido de 6 caracteres alfanuméricos en mayúscula (ej: `BSP-E42C19`), facilitando su dictado telefónico y verificación rápida.
