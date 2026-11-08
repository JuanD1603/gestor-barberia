# Documentacion de Diagramas UML del Sistema — BarberShop Pro

Este documento compila y formaliza la arquitectura, diseno estructural y modelado de comportamiento del sistema **BarberShop Pro** (version 1.1) bajo el estandar formal **UML 2.5 (ISO/IEC 19505)**.

Cada diagrama cuenta con su codigo fuente en formato Mermaid y sus versiones compiladas en alta resolucion tanto en formato de imagen de mapa de bits (PNG escala x2 con fondo blanco solido) como vectorial escalable (SVG), ubicadas en el directorio `docs/diagramas/` y respaldadas en el Escritorio del usuario (`Desktop/Diagramas_UML_BarberShop`).

---

## Indice de Diagramas UML

1. [Diagrama de Casos de Uso del Sistema](#1-diagrama-de-casos-de-uso-del-sistema)
2. [Diagrama de Clases del Dominio y Servicios](#2-diagrama-de-clases-del-dominio-y-servicios)
3. [Diagrama Entidad-Relacion (Modelo Relacional)](#3-diagrama-entidad-relacion-modelo-relacional)
4. [Diagrama de Secuencia: Agendamiento de Cita Multaservicio](#4-diagrama-de-secuencia-agendamiento-de-cita-multaservicio)
5. [Diagrama de Secuencia: Gestion de Inasistencia y Suspension](#5-diagrama-de-secuencia-gestion-de-inasistencia-y-suspension)
6. [Diagrama de Secuencia: Reprogramacion de Cita con Politicas](#6-diagrama-de-secuencia-reprogramacion-de-cita-con-politicas)
7. [Diagrama de Estados: Ciclo de Vida de Cita y Cuenta de Usuario](#7-diagrama-de-estados-ciclo-de-vida-de-cita-y-cuenta-de-usuario)
8. [Diagrama de Componentes (Arquitectura en Capas)](#8-diagrama-de-componentes-arquitectura-en-capas)
9. [Diagrama de Despliegue (Infraestructura de Ejecucion)](#9-diagrama-de-despliegue-infraestructura-de-ejecucion)
10. [Diagrama de Paquetes (Organizacion Modular)](#10-diagrama-de-paquetes-organizacion-modular)

---

## 1. Diagrama de Casos de Uso del Sistema

### Proposito
Modela las interacciones funcionales entre los actores externos (`Cliente`, `Barbero`, `Administrador` y `Servicio de Notificaciones`) y los modulos delimitados dentro del sistema BarberShop Pro, evidenciando las relaciones de inclusion (`<<include>>`) para calculos, codigos de reserva y politicas de suspension.

### Archivos Generados
- Codigo fuente: `docs/diagramas/01-casos-de-uso.mmd`
- Imagen de alta resolucion: `docs/diagramas/01-casos-de-uso.png`
- Vectorial: `docs/diagramas/01-casos-de-uso.svg`

```mermaid
flowchart LR
    %% Actores Principales del Sistema
    Cliente["Cliente"]
    Barbero["Barbero"]
    Admin["Administrador"]
    Notificador["Servicio de Notificaciones"]

    subgraph Sistema ["BarberShop Pro - Limite del Sistema"]
        CU01(["CU01: Iniciar sesion"])
        CU02(["CU02: Cerrar sesion"])
        CU03(["CU03: Recuperar contrasena"])
        CU04(["CU04: Registrar cuenta de cliente"])

        CU05(["CU05: Gestionar barberos"])
        CU06(["CU06: Gestionar catalogo de servicios"])
        CU07(["CU07: Supervisar citas globales"])

        CU08(["CU08: Configurar horarios semanales"])
        CU09(["CU09: Registrar bloqueo de fechas"])
        CU10(["CU10: Consultar agenda de citas"])
        CU11(["CU11: Registrar atencion de cita"])
        CU12(["CU12: Registrar inasistencia de cliente"])

        CU13(["CU13: Consultar disponibilidad"])
        CU14(["CU14: Agendar cita multaservicio"])
        CU15(["CU15: Consultar mis citas"])
        CU16(["CU16: Cancelar cita reservada"])
        CU17(["CU17: Reprogramar cita"])

        CU18(["CU18: Calcular duracion y costo total"])
        CU19(["CU19: Generar codigo de reserva"])
        CU20(["CU20: Enviar notificacion por correo"])
        CU21(["CU21: Evaluar politica de suspension"])
    end

    Cliente --> CU01
    Cliente --> CU02
    Cliente --> CU03
    Cliente --> CU04
    Cliente --> CU13
    Cliente --> CU14
    Cliente --> CU15
    Cliente --> CU16
    Cliente --> CU17

    Barbero --> CU01
    Barbero --> CU02
    Barbero --> CU03
    Barbero --> CU08
    Barbero --> CU09
    Barbero --> CU10
    Barbero --> CU11
    Barbero --> CU12

    Admin --> CU01
    Admin --> CU02
    Admin --> CU03
    Admin --> CU05
    Admin --> CU06
    Admin --> CU07

    CU14 -.->|include| CU18
    CU14 -.->|include| CU19
    CU14 -.->|include| CU20
    CU12 -.->|include| CU21
    CU16 -.->|include| CU20
    CU17 -.->|include| CU20

    CU20 --- Notificador
```

---

## 2. Diagrama de Clases del Dominio y Servicios

### Proposito
Representa la estructura estatica orientada a objetos de la aplicacion, detallando atributos tipados, metodos de instancia, operaciones de servicios de aplicacion, constantes de politicas y multiplicidades exactas de las asociaciones y composiciones.

### Archivos Generados
- Codigo fuente: `docs/diagramas/02-diagrama-clases.mmd`
- Imagen de alta resolucion: `docs/diagramas/02-diagrama-clases.png`
- Vectorial: `docs/diagramas/02-diagrama-clases.svg`

```mermaid
classDiagram
    direction TB

    class Usuario {
        +int id
        +string nombre
        +string telefono
        +string email
        +string password_hash
        +string rol
        +date suspendido_hasta
        +bool activo
        +esta_suspendido(fecha) bool
        +validar_password(password) bool
    }

    class Barbero {
        +int id
        +int usuario_id
        +string foto_url
        +bool activo
        +nombre() string
        +email() string
        +telefono() string
    }

    class Servicio {
        +int id
        +string nombre
        +int duracion_minutos
        +decimal precio
        +bool activo
    }

    class Cita {
        +int id
        +string codigo_reserva
        +int cliente_id
        +int barbero_id
        +date fecha
        +time hora_inicio
        +time hora_fin
        +string estado
        +decimal total
        +bool reprogramada
        +string notas
        +datetime creada_el
        +calcular_total() decimal
        +puede_cancelarse(ahora) bool
        +puede_reprogramarse(ahora) bool
    }

    class CitaServicio {
        +int id
        +int cita_id
        +int servicio_id
        +decimal precio_aplicado
        +int duracion_minutos
    }

    class Disponibilidad {
        +int id
        +int barbero_id
        +int dia_semana
        +time hora_inicio
        +time hora_fin
    }

    class Bloqueo {
        +int id
        +int barbero_id
        +date fecha
        +time hora_inicio
        +time hora_fin
        +es_dia_completo() bool
    }

    class TokenRecuperacion {
        +int id
        +int usuario_id
        +string token_hash
        +datetime expira_en
        +bool usado
        +esta_vigente(ahora) bool
    }

    class Sesion {
        +int id
        +int usuario_id
        +string token_hash
        +datetime creada_el
        +datetime ultima_actividad
        +esta_activa(ahora, limite) bool
    }

    class PoliticasNegocio {
        <<singleton>>
        +timedelta VIGENCIA_ENLACE_RECUPERACION = 1h
        +int INTERVALO_MINUTOS = 30
        +timedelta ANTICIPACION_MINIMA = 12h
        +timedelta INACTIVIDAD_SESION = 15m
        +int MAX_CITAS_ACTIVAS = 2
        +int INASISTENCIAS_PARA_SUSPENDER = 2
        +int MESES_VENTANA_INASISTENCIAS = 3
        +int MESES_SUSPENSION = 1
        +validar_anticipacion(fecha_hora_cita, ahora) bool
        +evaluar_suspension_por_inasistencias(inasistencias) date
    }

    class CitaService {
        <<service>>
        +crear_cita(cliente_id, barbero_id, fecha, hora_inicio, servicios_ids) Cita
        +cancelar_cita(cita_id, usuario_actual) Cita
        +reprogramar_cita(cita_id, nueva_fecha, nueva_hora, usuario_actual) Cita
        +marcar_atendida(cita_id, barbero_id) Cita
        +marcar_inasistencia(cita_id, barbero_id) Cita
        +obtener_disponibilidad(barbero_id, fecha, duracion) List~Slot~
    }

    class NotificacionService {
        <<service>>
        +enviar_confirmacion_reserva(cita) bool
        +enviar_cancelacion(cita, motivo) bool
        +enviar_inasistencia(cita, suspendido) bool
        +enviar_recuperacion_contrasena(email, token) bool
    }

    Usuario "1" --> "0..1" Barbero : "tiene perfil"
    Usuario "1" --> "0..*" Cita : "reserva como cliente"
    Usuario "1" *-- "0..*" TokenRecuperacion : "solicita"
    Usuario "1" *-- "0..*" Sesion : "inicia"

    Barbero "1" --> "0..*" Cita : "atiende"
    Barbero "1" *-- "0..*" Disponibilidad : "define semanalmente"
    Barbero "1" *-- "0..*" Bloqueo : "registra excepciones"

    Cita "1" *-- "1..*" CitaServicio : "contiene detalle"
    Servicio "1" --> "0..*" CitaServicio : "es seleccionado en"

    CitaService ..> Cita : "gestiona"
    CitaService ..> PoliticasNegocio : "consulta reglas"
    CitaService ..> NotificacionService : "dispara alertas"
```

---

## 3. Diagrama Entidad-Relacion (Modelo Relacional)

### Proposito
Describe el esquema fisico y logico de la base de datos relacional (compatible con SQLite y MySQL 8.0), identificando claves primarias (PK), foraneas (FK), restricciones de integridad referencial (`RESTRICT`, `CASCADE`), indices de rendimiento y tipos SQL.

### Archivos Generados
- Codigo fuente: `docs/diagramas/03-diagrama-erd.mmd`
- Imagen de alta resolucion: `docs/diagramas/03-diagrama-erd.png`
- Vectorial: `docs/diagramas/03-diagrama-erd.svg`

```mermaid
erDiagram
    USUARIOS ||--o| BARBEROS : "1 a 0..1 (usuario_id)"
    USUARIOS ||--o{ CITAS : "1 a 0..N (cliente_id)"
    USUARIOS ||--o{ TOKENS_RECUPERACION : "1 a 0..N (usuario_id)"
    USUARIOS ||--o{ SESIONES : "1 a 0..N (usuario_id)"
    BARBEROS ||--o{ CITAS : "1 a 0..N (barbero_id)"
    BARBEROS ||--o{ DISPONIBILIDADES : "1 a 0..N (barbero_id)"
    BARBEROS ||--o{ BLOQUEOS : "1 a 0..N (barbero_id)"
    CITAS ||--|{ CITAS_SERVICIOS : "1 a 1..N (cita_id)"
    SERVICIOS ||--o{ CITAS_SERVICIOS : "1 a 0..N (servicio_id)"

    USUARIOS {
        int id PK
        string nombre "VARCHAR(120)"
        string telefono "VARCHAR(25)"
        string email UK "VARCHAR(120)"
        string password_hash "VARCHAR(255)"
        string rol "VARCHAR(20)"
        date suspendido_hasta "DATE NULL"
        boolean activo "BOOLEAN DEFAULT TRUE"
    }

    BARBEROS {
        int id PK
        int usuario_id FK "UNIQUE, RESTRICT"
        string foto_url "VARCHAR(255) NULL"
        boolean activo "BOOLEAN DEFAULT TRUE"
    }

    SERVICIOS {
        int id PK
        string nombre "VARCHAR(100)"
        int duracion_minutos "INTEGER"
        decimal precio "NUMERIC(10,2)"
        boolean activo "BOOLEAN DEFAULT TRUE"
    }

    CITAS {
        int id PK
        string codigo_reserva UK "VARCHAR(20)"
        int cliente_id FK "RESTRICT, INDEX"
        int barbero_id FK "RESTRICT, INDEX"
        date fecha "DATE, INDEX"
        time hora_inicio "TIME"
        time hora_fin "TIME"
        string estado "VARCHAR(30), INDEX"
        decimal total "NUMERIC(10,2)"
        boolean reprogramada "BOOLEAN DEFAULT FALSE"
        text notas "TEXT NULL"
        datetime creada_el "DATETIME"
    }

    CITAS_SERVICIOS {
        int id PK
        int cita_id FK "CASCADE, INDEX"
        int servicio_id FK "RESTRICT"
        decimal precio_aplicado "NUMERIC(10,2)"
        int duracion_minutos "INTEGER"
    }

    DISPONIBILIDADES {
        int id PK
        int barbero_id FK "CASCADE, INDEX"
        int dia_semana "INTEGER (0-6)"
        time hora_inicio "TIME"
        time hora_fin "TIME"
    }

    BLOQUEOS {
        int id PK
        int barbero_id FK "CASCADE, INDEX"
        date fecha "DATE, INDEX"
        time hora_inicio "TIME NULL"
        time hora_fin "TIME NULL"
    }

    TOKENS_RECUPERACION {
        int id PK
        int usuario_id FK "CASCADE, INDEX"
        string token_hash UK "VARCHAR(64)"
        datetime expira_en "DATETIME"
        boolean usado "BOOLEAN DEFAULT FALSE"
    }

    SESIONES {
        int id PK
        int usuario_id FK "CASCADE, INDEX"
        string token_hash UK "VARCHAR(64)"
        datetime creada_el "DATETIME"
        datetime ultima_actividad "DATETIME"
    }
```

---

## 4. Diagrama de Secuencia: Agendamiento de Cita Multaservicio

### Proposito
Ilustra el intercambio dinamico de mensajes para el caso de uso `CU14: Agendar cita multaservicio` (RF-13 a RF-20), cubriendo las validaciones de suspension del cliente, limite de citas activas (PN-09), comprobacion de choques de horario, persistencia atomica con snapshot de precios y despacho de confirmacion por correo.

### Archivos Generados
- Codigo fuente: `docs/diagramas/04-secuencia-agendamiento.mmd`
- Imagen de alta resolucion: `docs/diagramas/04-secuencia-agendamiento.png`
- Vectorial: `docs/diagramas/04-secuencia-agendamiento.svg`

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente
    participant UI as Frontend (React / Vite)
    participant Router as API Router (FastAPI)
    participant CitaSvc as CitaService
    participant Politicas as PoliticasNegocio
    participant DB as Base de Datos (SQLAlchemy)
    participant Notif as NotificacionService

    Cliente->>UI: Selecciona barbero, servicios, fecha y hora
    UI->>Router: POST /citas (barbero_id, fecha, hora_inicio, servicios_ids)
    Note over Router: Valida sesion activa (RNF-02, PN-07)
    Router->>CitaSvc: crear_cita(cliente_id, datos_cita)

    CitaSvc->>Politicas: verificar_suspension(cliente_id)
    alt Cliente suspendido por inasistencias
        Politicas-->>CitaSvc: Error: Cuenta suspendida hasta fecha X
        CitaSvc-->>Router: HTTP 400 Bad Request
        Router-->>UI: Mensaje de sancion activa
        UI-->>Cliente: Notificacion de suspension
    else Cliente habilitado
        Politicas-->>CitaSvc: Habilitado
        CitaSvc->>Politicas: verificar_limite_citas_activas(cliente_id)
        alt Excede maximo de 2 citas activas (PN-09)
            Politicas-->>CitaSvc: Error: Limite alcanzado
            CitaSvc-->>Router: HTTP 400 Bad Request
            Router-->>UI: Limite de citas activas alcanzado
            UI-->>Cliente: Alerta informativa
        else Limite correcto
            CitaSvc->>DB: Consultar bloqueos y citas existentes del barbero
            DB-->>CitaSvc: Lista de solapamientos
            alt Conflicto de horario o fuera de disponibilidad
                CitaSvc-->>Router: HTTP 409 Conflict
                Router-->>UI: Horario no disponible
                UI-->>Cliente: Sugerencia de otro horario
            else Horario libre y valido
                CitaSvc->>CitaSvc: Generar codigo_reserva unico (ej. RES-ABC12)
                CitaSvc->>CitaSvc: Calcular duracion total y precio snapshot
                CitaSvc->>DB: INSERT INTO citas, INSERT INTO citas_servicios
                DB-->>CitaSvc: Cita confirmada (ID, codigo, estado=Programada)
                
                par Envio de notificacion asincrona
                    CitaSvc->>Notif: enviar_confirmacion_reserva(cita)
                    Notif-->>Cliente: Email con detalles y codigo de reserva
                and Respuesta al cliente
                    CitaSvc-->>Router: CitaDetalleResponse (HTTP 201)
                    Router-->>UI: JSON con reserva exitosa
                    UI-->>Cliente: Pantalla de confirmacion con codigo
                end
            end
        end
    end
```

---

## 5. Diagrama de Secuencia: Gestion de Inasistencia y Suspension

### Proposito
Detalla el flujo de ejecucion cuando un barbero reporta que un cliente no comparecio a su cita (RF-27 y RF-29), aplicando la regla de negocio PN-10 (suspension automatica de 1 mes al registrar 2 inasistencias en una ventana de 3 meses).

### Archivos Generados
- Codigo fuente: `docs/diagramas/05-secuencia-inasistencia.mmd`
- Imagen de alta resolucion: `docs/diagramas/05-secuencia-inasistencia.png`
- Vectorial: `docs/diagramas/05-secuencia-inasistencia.svg`

```mermaid
sequenceDiagram
    autonumber
    actor Barbero as Barbero
    participant UI as Frontend (Agenda Barbero)
    participant Router as API Router (FastAPI)
    participant CitaSvc as CitaService
    participant Politicas as PoliticasNegocio
    participant DB as Base de Datos (SQLAlchemy)
    participant Notif as NotificacionService
    actor Cliente as Cliente

    Barbero->>UI: Presiona "Marcar Inasistencia" en cita programada
    UI->>Router: POST /citas/{id}/inasistencia
    Note over Router: Valida rol barbero y pertenencia de la cita

    Router->>CitaSvc: marcar_inasistencia(cita_id, barbero_id)
    CitaSvc->>DB: Obtener cita por ID
    DB-->>CitaSvc: Registro de la Cita

    alt Fecha y hora de cita aun no ha iniciado
        CitaSvc-->>Router: HTTP 400 (No se puede marcar antes de la hora)
        Router-->>UI: Error de anticipacion
        UI-->>Barbero: Mensaje de restriccion
    else Hora de inicio superada
        CitaSvc->>DB: UPDATE citas SET estado = 'Inasistencia' WHERE id = cita_id
        
        CitaSvc->>DB: Contar inasistencias del cliente en los ultimos 3 meses
        DB-->>CitaSvc: Total inasistencias acumuladas

        alt Total inasistencias >= 2 (PN-10)
            CitaSvc->>Politicas: calcular_fecha_suspension(1 mes)
            Politicas-->>CitaSvc: Nueva fecha suspendido_hasta
            CitaSvc->>DB: UPDATE usuarios SET suspendido_hasta = fecha_fin WHERE id = cliente_id
            
            par Notificar suspension al cliente
                CitaSvc->>Notif: enviar_alerta_suspension(cliente, fecha_fin)
                Notif-->>Cliente: Correo notificando suspension por 1 mes
            end
        else Menor a 2 inasistencias
            par Notificar inasistencia preventiva
                CitaSvc->>Notif: enviar_aviso_inasistencia(cliente, advertencia)
                Notif-->>Cliente: Correo de advertencia sobre inasistencia
            end
        end

        DB-->>CitaSvc: Transaccion completada con exito
        CitaSvc-->>Router: CitaActualizadaResponse (HTTP 200)
        Router-->>UI: Estado actualizado a Inasistencia
        UI-->>Barbero: Confirmacion visual en la agenda
    end
```

---

## 6. Diagrama de Secuencia: Reprogramacion de Cita con Politicas

### Proposito
Modela el proceso de reprogramacion de una cita (RF-23), haciendo cumplir la politica de una unica reprogramacion permitida (`reprogramada == false`) y el umbral de anticipacion minima de 12 horas (PN-04 y PN-05).

### Archivos Generados
- Codigo fuente: `docs/diagramas/06-secuencia-reprogramacion.mmd`
- Imagen de alta resolucion: `docs/diagramas/06-secuencia-reprogramacion.png`
- Vectorial: `docs/diagramas/06-secuencia-reprogramacion.svg`

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente
    participant UI as Frontend (Mis Citas)
    participant Router as API Router (FastAPI)
    participant CitaSvc as CitaService
    participant Politicas as PoliticasNegocio
    participant DB as Base de Datos (SQLAlchemy)
    participant Notif as NotificacionService

    Cliente->>UI: Solicita reprogramar cita (nueva fecha y hora)
    UI->>Router: PATCH /citas/{id}/reprogramar (nueva_fecha, nueva_hora)
    Note over Router: Valida token y pertenencia de la cita

    Router->>CitaSvc: reprogramar_cita(cita_id, cliente_id, nueva_fecha, nueva_hora)
    CitaSvc->>DB: Consultar cita por ID
    DB-->>CitaSvc: Datos de la cita actual

    alt Cita ya fue reprogramada anteriormente (reprogramada == true)
        CitaSvc-->>Router: HTTP 400 (Politica PN-05: Solo se permite una reprogramacion)
        Router-->>UI: Mensaje de error (Limite de reprogramacion excedido)
        UI-->>Cliente: Alerta: Ya se uso la unica reprogramacion permitida
    else Primera reprogramacion
        CitaSvc->>Politicas: validar_anticipacion(fecha_hora_cita, ahora >= 12h)
        alt Menos de 12 horas de anticipacion (PN-05)
            Politicas-->>CitaSvc: Anticipacion insuficiente
            CitaSvc-->>Router: HTTP 400 (Politica PN-05: Minimo 12h de anticipacion)
            Router-->>UI: Error por tiempo extemporaneo
            UI-->>Cliente: Rechazo por politica de 12 horas
        else Anticipacion valida (>= 12 horas)
            CitaSvc->>DB: Validar disponibilidad de barbero en nuevo horario
            alt Choque de horario con otra cita o bloqueo
                DB-->>CitaSvc: Horario ocupado
                CitaSvc-->>Router: HTTP 409 Conflict
                Router-->>UI: Horario no disponible
                UI-->>Cliente: Solicitud de elegir otro horario
            else Horario libre
                CitaSvc->>DB: UPDATE citas SET fecha = nueva_fecha, hora_inicio = ..., reprogramada = true
                DB-->>CitaSvc: Cita actualizada exitosamente

                par Notificaciones de reprogramacion
                    CitaSvc->>Notif: enviar_confirmacion_reprogramacion(cita)
                    Notif-->>Cliente: Correo con nuevo horario y confirmacion
                end

                CitaSvc-->>Router: CitaReprogramadaResponse (HTTP 200)
                Router-->>UI: Confirmacion y nuevo horario
                UI-->>Cliente: Vista actualizada con la nueva fecha
            end
        end
    end
```

---

## 7. Diagrama de Estados: Ciclo de Vida de Cita y Cuenta de Usuario

### Proposito
Modela las maquinas de estados finitos que gobiernan los ciclos de vida de:
1. Una `Cita` (transiciones entre `Programada`, `Atendida`, `Cancelada` e `Inasistencia`).
2. Una `Cuenta de Usuario` (transiciones entre `Registrado`, `Activo`, `Suspendido` e `Inactivo`).

### Archivos Generados
- Codigo fuente: `docs/diagramas/07-estados-cita-usuario.mmd`
- Imagen de alta resolucion: `docs/diagramas/07-estados-cita-usuario.png`
- Vectorial: `docs/diagramas/07-estados-cita-usuario.svg`

```mermaid
stateDiagram-v2
    direction TB

    state "Ciclo de Vida de una Cita" as CitaStates {
        [*] --> Programada : Cliente reserva cita con exito

        Programada --> Atendida : Barbero confirma atencion completada (RF-26)
        Programada --> Cancelada : Cliente cancela con anticipacion >= 12h (RF-21, PN-04)
        Programada --> Cancelada : Admin cancela por eliminacion de barbero (PN-08)
        Programada --> Inasistencia : Barbero registra no presentacion (RF-27, hora cumplida)
        Programada --> Programada : Reprogramacion con anticipacion >= 12h (max 1 vez, PN-05)

        Atendida --> [*]
        Cancelada --> [*]
        Inasistencia --> [*]
    }

    state "Ciclo de Estados de Cuenta de Usuario" as UsuarioStates {
        [*] --> Registrado : Creacion de cuenta (RF-01, RF-05)
        Registrado --> Activo : Verificacion y primer acceso
        Activo --> Activo : Inicio y cierre de sesion normal
        
        Activo --> Suspendido : Acumula 2 inasistencias en 3 meses (RF-29, PN-10)
        Suspendido --> Activo : Vence periodo de suspension de 1 mes
        
        Activo --> Inactivo : Desactivacion logica por Administrador (RF-07)
        Inactivo --> [*]
    }
```

---

## 8. Diagrama de Componentes (Arquitectura en Capas)

### Proposito
Muestra la arquitectura en capas desacopladas (Clean Layer Separation) del sistema: Capa de Presentacion (Frontend SPA), Capa de Enrutamiento y Validacion (FastAPI), Capa de Dominio y Politicas (`services.py`, `politicas.py`), Capa de Persistencia (SQLAlchemy 2.0 ORM) y Servicios Externos de Notificacion (SMTP).

### Archivos Generados
- Codigo fuente: `docs/diagramas/08-diagrama-componentes.mmd`
- Imagen de alta resolucion: `docs/diagramas/08-diagrama-componentes.png`
- Vectorial: `docs/diagramas/08-diagrama-componentes.svg`

```mermaid
flowchart TB
    subgraph FrontendSPA ["Capa de Presentacion (Frontend SPA - React 18 / Vite / Tailwind)"]
        UI_Router["Enrutador de Vistas (React Router)"]
        UI_Auth["Modulo de Autenticacion (Login / Registro / Recuperar)"]
        UI_Cliente["Modulo Cliente (Catalogo, Reserva Multaservicio, Mis Citas)"]
        UI_Barbero["Modulo Barbero (Agenda Diaria, Disponibilidad, Bloqueos)"]
        UI_Admin["Modulo Admin (Gestion Barberos, Servicios, Supervisores)"]
        UI_ClientHTTP["Cliente API HTTP (Fetch / Axios / Interceptores)"]
    end

    subgraph BackendAPI ["Capa de Aplicacion y Enrutamiento (FastAPI / Uvicorn)"]
        API_App["FastAPI Application Core (main.py)"]
        API_Security["Middleware de Seguridad y Sesion (RNF-02, PN-07)"]
        API_Routers["Enrutadores REST (/auth, /barberos, /servicios, /citas, /agenda)"]
        API_Schemas["Validadores de Entrada y Salida (Pydantic v2 Schemas)"]
    end

    subgraph DomainLayer ["Capa de Dominio y Logica de Negocio (Clean Architecture)"]
        SVC_Citas["Servicio de Citas (CitaService)"]
        SVC_Auth["Servicio de Autenticacion y Hashing (Security)"]
        SVC_Disponibilidad["Servicio de Disponibilidad y Bloqueos"]
        POL_Negocio["Motor de Politicas del Negocio (politicas.py PN-01 a PN-10)"]
        NOTIF_Engine["Motor de Notificaciones y Plantillas (notificaciones.py)"]
    end

    subgraph PersistenceLayer ["Capa de Acceso a Datos y Persistencia (ORM)"]
        ORM_Engine["Motor SQLAlchemy 2.0 (database.py)"]
        ORM_Models["Modelos de Entidad Declarativos (models.py)"]
        DB_Storage[("Base de Datos Relacional SQLite / MySQL")]
    end

    subgraph ExternalServices ["Servicios Externos de Infraestructura"]
        SMTP_Server["Servidor SMTP / Correo Electronico"]
    end

    FrontendSPA -->|HTTP REST JSON / Bearer Token| BackendAPI
    UI_Router --> UI_Auth
    UI_Router --> UI_Cliente
    UI_Router --> UI_Barbero
    UI_Router --> UI_Admin
    UI_Auth --> UI_ClientHTTP
    UI_Cliente --> UI_ClientHTTP
    UI_Barbero --> UI_ClientHTTP
    UI_Admin --> UI_ClientHTTP

    API_App --> API_Security
    API_App --> API_Routers
    API_Routers --> API_Schemas
    API_Routers --> DomainLayer

    SVC_Citas --> POL_Negocio
    SVC_Citas --> NOTIF_Engine
    SVC_Disponibilidad --> POL_Negocio
    DomainLayer --> PersistenceLayer

    ORM_Engine --> ORM_Models
    ORM_Models --> DB_Storage
    NOTIF_Engine -.->|Protocolo SMTP / TLS| SMTP_Server
```

---

## 9. Diagrama de Despliegue (Infraestructura de Ejecucion)

### Proposito
Especifica la topologia fisica y logica de despliegue: nodos de cliente (navegador web), servidores web frontend, servidores de aplicacion backend (Uvicorn ASGI) y almacenamiento de persistencia (SQLite/MySQL).

### Archivos Generados
- Codigo fuente: `docs/diagramas/09-diagrama-despliegue.mmd`
- Imagen de alta resolucion: `docs/diagramas/09-diagrama-despliegue.png`
- Vectorial: `docs/diagramas/09-diagrama-despliegue.svg`

```mermaid
flowchart TB
    subgraph ClientNode ["Dispositivo de Usuario (Cliente / Barbero / Administrador)"]
        Browser["Navegador Web Moderno (Chrome, Edge, Firefox, Safari)"]
        SPA_Artifact["Artefacto SPA Ejecutable (HTML5, JS Bundles, CSS)"]
        Browser --- SPA_Artifact
    end

    subgraph HostServer ["Servidor de Alojamiento y Ejecucion"]
        subgraph WebServerNode ["Servidor Web Frontend"]
            WebServer["Vite Dev Server (Dev) / Servidor Nginx (Prod)"]
            PortFrontend["Puerto HTTP: 5173 / 80"]
            WebServer --- PortFrontend
        end

        subgraph AppServerNode ["Servidor de Aplicaciones Backend (Python Runtime)"]
            ASGIRunner["Uvicorn ASGI Server"]
            FastAPIApp["Aplicacion BarberShop Pro Backend (FastAPI)"]
            PythonEnv["Entorno Virtual Python (venv - Python 3.11+)"]
            PortBackend["Puerto HTTP REST: 8000"]
            
            ASGIRunner --- FastAPIApp
            FastAPIApp --- PythonEnv
            ASGIRunner --- PortBackend
        end

        subgraph StorageNode ["Servidor de Persistencia de Datos"]
            DatabaseEngine[("Motor de Base de Datos - SQLite / MySQL 8.0")]
            DBFile["Archivo de Datos: barberia.db (SQLite)"]
            DatabaseEngine --- DBFile
        end
    end

    subgraph ExternalCloud ["Servicios en la Nube"]
        SMTPServer["Servidor SMTP Externo (Notificaciones por Correo)"]
    end

    SPA_Artifact -->|HTTP / HTTPS - Solicitud de Assets| PortFrontend
    SPA_Artifact -->|HTTP REST JSON / Bearer Auth - API Calls| PortBackend
    FastAPIApp -->|SQLAlchemy Core / Dialecto SQLite / MySQL| DatabaseEngine
    FastAPIApp -.->|SMTP / STARTTLS - Puerto 587| SMTPServer
```

---

## 10. Diagrama de Paquetes (Organizacion Modular)

### Proposito
Ilustra la modularizacion del proyecto bajo las directrices de ISO/IEC 12207, organizando los paquetes de Frontend, Backend y Tests, y declarando explicitamente las dependencias unidireccionales para evitar acoplamiento circular.

### Archivos Generados
- Codigo fuente: `docs/diagramas/10-diagrama-paquetes.mmd`
- Imagen de alta resolucion: `docs/diagramas/10-diagrama-paquetes.png`
- Vectorial: `docs/diagramas/10-diagrama-paquetes.svg`

```mermaid
flowchart TB
    subgraph PkgFrontend ["Paquete: src/frontend"]
        subgraph PkgViews ["Vistas y Paginas"]
            V_Auth["AuthViews (Login, Registro, Recuperar)"]
            V_Cliente["ClienteViews (Catalogo, Reservar, MisCitas)"]
            V_Barbero["BarberoViews (Agenda, Disponibilidad, Bloqueos)"]
            V_Admin["AdminViews (Barberos, Servicios, Supervisores)"]
        end
        subgraph PkgComponents ["Componentes Reutilizables"]
            C_UI["UI Primitives (Botones, Modales, Inputs, Tablas)"]
            C_Layout["Layout (Navbar, Footers, Contenedores)"]
        end
    end

    subgraph PkgBackend ["Paquete: src/backend"]
        subgraph PkgAPI ["Capa de Controladores y Schemas"]
            API_Main["main.py (Configuracion y Routers)"]
            API_Schemas["schemas.py (DTOs y Validaciones Pydantic)"]
        end

        subgraph PkgServices ["Capa de Servicios y Logica de Negocio"]
            SVC_Services["services.py (Casos de Uso de Citas, Usuarios, etc.)"]
            SVC_Notif["notificaciones.py / plantillas_correo.py"]
        end

        subgraph PkgPolicies ["Capa de Politicas y Reglas"]
            POL_Rules["politicas.py (Reglas PN-01 a PN-10)"]
        end

        subgraph PkgSecurity ["Capa de Seguridad"]
            SEC_Security["security.py (Cifrado bcrypt, Hashing de Tokens)"]
        end

        subgraph PkgData ["Capa de Acceso a Datos y Persistencia"]
            DATA_Models["models.py (Entidades ORM SQLAlchemy)"]
            DATA_DB["database.py (Conexion y Sesion de BD)"]
        end
    end

    subgraph PkgTests ["Paquete: tests"]
        T_Unit["Pruebas Unitarias (Cuentas, Barberos, Servicios, Citas)"]
        T_Inasistencia["Pruebas de Inasistencias y Suspensiones"]
        T_NonFunc["Pruebas No Funcionales (Seguridad, Concurrencia, Zonas Horarias)"]
    end

    PkgViews -.->|usa| PkgComponents
    PkgFrontend -->|HTTP REST JSON| PkgAPI
    PkgAPI -->|delega a| PkgServices
    PkgAPI -.->|valida con| API_Schemas
    PkgServices -->|evalua| POL_Rules
    PkgServices -->|utiliza| SEC_Security
    PkgServices -->|consulta / persiste| DATA_Models
    DATA_Models -->|mapea con| DATA_DB
    PkgTests -.->|verifica cobertura| PkgBackend
```

