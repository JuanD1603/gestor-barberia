<<<<<<< HEAD
# Guía Metodológica de Gestión de Proyecto con Trello (Kanban)
## Proyecto: BarberShop Pro 💈✂️

**Materia:** Ingeniería de Software II (Código 17934) — Cotecnova  
**Responsable de Documentación y Metodología:** Juan David Monroy  
**Líder Técnico:** Elizabeth Ramirez  
**Responsable de Calidad:** Juan David Osorio  
**Responsable de Pruebas:** Sebastian Orozco  
**Versión:** 1.0 (Seguimiento 1)  

---

## 1. Propósito y Filosofía Ágil

Esta guía establece el estándar operativo para la gestión visual, seguimiento del flujo de trabajo y aseguramiento de la calidad en el proyecto **BarberShop Pro** mediante la herramienta **Trello**, aplicando los principios de la metodología **Kanban**:

- **Visualizar el trabajo**: Hacer visible el estado real de cada historia de usuario y tarea técnica.
- **Limitar el trabajo en progreso (WIP - Work In Progress)**: Evitar la sobrecarga y maximizar la entrega continua de valor.
- **Gestionar el flujo**: Detectar cuellos de botella tempranamente entre la especificación, el desarrollo y el aseguramiento de la calidad.
- **Trazabilidad rigurosa**: Conectar directamente cada tarjeta de Trello con los commits y ramas de Git del repositorio.

---

## 2. Estructura del Tablero Kanban en Trello

El tablero oficial de **BarberShop Pro** se organiza en 5 columnas secuenciales:

```
+--------------------+   +-------------------+   +--------------------+   +----------------------+   +---------------+
| 📌 Product Backlog |-->| 📋 Sprint / To Do |-->| 🚧 Doing (WIP: 2) |-->| 🔍 Code Review & QA  |-->|   ✅ Done     |
+--------------------+   +-------------------+   +--------------------+   +----------------------+   +---------------+
```

### 2.1 Descripción de las Columnas

1. **`📌 Product Backlog` (Requisitos Priorizados)**:
   - Almacena el inventario completo de Historias de Usuario (HU-01 a HU-08) y requerimientos técnicos del sistema documentados en `docs/especificacion.md`.
   - Se ordenan de arriba hacia abajo según su valor de negocio y prioridad MoSCoW.

2. **`📋 Sprint / To Do` (Por Hacer)**:
   - Contiene las tarjetas seleccionadas para la iteración activa que han superado el criterio de **Definition of Ready (DoR)**.
   - Cada tarjeta en esta lista ya cuenta con responsable asignado y alcance claro.

3. **`🚧 Doing / In Progress` (En Desarrollo Activo)**:
   - Tarjetas en ejecución directa por los miembros del equipo.
   - **Regla de WIP**: Ningún integrante debe tener más de **2 tarjetas simultáneas** en esta columna.

4. **`🔍 Code Review & QA` (Revisión y Aseguramiento de Calidad)**:
   - Se transfieren las tarjetas cuyo código o documentación ya ha sido subido en una rama o pull request.
   - Se realizan pruebas funcionales en Swagger (`/docs`), validaciones de tipos y comprobación de los escenarios Gherkin.

5. **`✅ Done` (Finalizado y Aprobado)**:
   - Tarjetas que satisfacen completamente la **Definition of Done (DoD)** y han sido integradas en la rama principal (`main`).

---

## 3. Políticas de Transición de Calidad

### 3.1 Definition of Ready (DoR) - Criterios para iniciar una tarjeta
Una tarjeta solo puede ser movida de **Product Backlog** a **To Do** si cumple con:
- [x] Título claro siguiendo la convención de nomenclaturas (`[MÓDULO-ID] Nombre descriptivo`).
- [x] Historia de Usuario redactada bajo el formato estándar (*Como... Quiero... Para...*).
- [x] Criterios de Aceptación definidos en formato **Gherkin** (*Dado que... Cuando... Entonces...*).
- [x] Dependencias técnicas resueltas o claramente identificadas.
- [x] Responsable del equipo asignado formalmente.

### 3.2 Definition of Done (DoD) - Criterios para finalizar una tarjeta
Una tarjeta solo puede ser movida a la columna **Done** cuando:
- [x] El código fuente o documento cumple con los estándares institucionales y arquitectura del proyecto.
- [x] Se han probado y aprobado todos los escenarios Gherkin definidos en los criterios de aceptación.
- [x] En el caso de endpoints, se ha verificado su respuesta y validaciones de error en Swagger UI (`http://127.0.0.1:8000/docs`).
- [x] El commit o Pull Request ha sido integrado en la rama `main` siguiendo la convención de commits semánticos.
- [x] No se introducen archivos prohibidos (`.env`, secretos, `*.db`, cachés) respetando el archivo `.gitignore`.

---

## 4. Código de Etiquetas (Labels)

Se utiliza un esquema visual de etiquetas por colores para categorizar el tipo de trabajo y el componente técnico:

| Color | Etiqueta | Propósito |
| :--- | :--- | :--- |
| 🟣 **Morado** | `backend` | Lógica de FastAPI, servicios de negocio, modelos SQLAlchemy y ORM. |
| 🔵 **Azul** | `frontend` | Interfaz gráfica React, componentes Vite, estilos CSS y consumo de API. |
| 🟠 **Naranja** | `documentacion` | Manuales, especificaciones BDD, README institucional y guías metodológicas. |
| 🟢 **Verde** | `testing / qa` | Pruebas unitarias, suites de pytest y validaciones de aceptación. |
| 🔴 **Rojo** | `bug / fix` | Corrección de fallos o incidencias encontradas en QA. |
| 🟡 **Amarillo** | `prioridad-alta` | Requisitos críticos para el agendamiento y funcionamiento central. |

---

## 5. Plantilla Estándar de Tarjetas (Cards)

Toda tarjeta creada en Trello debe seguir la siguiente estructura dentro de su descripción:

```markdown
### 🎯 Objetivo
Breve descripción de lo que se busca lograr con esta tarea.

### 👤 Historia de Usuario Asociada
**Como** [rol del usuario]  
**Quiero** [acción o funcionalidad]  
**Para** [beneficio o valor de negocio]

### 🧪 Criterios de Aceptación (Gherkin)
- **Escenario 1**: [Nombre del caso de éxito]
  - **Dado que** [contexto inicial]
  - **Cuando** [acción realizada]
  - **Entonces** [resultado esperado]

### 📋 Checklist Técnico
- [ ] Tarea técnica 1
- [ ] Tarea técnica 2
- [ ] Validación en Swagger / Navegador
- [ ] Commit semántico y push
```

---

## 6. Ejemplos Prácticos de Tarjetas por Rol

### Ejemplo A: Tarjeta de Documentación (Asignada a Juan David Monroy)
- **Título**: `[DOC-01] Documentación Institucional y Especificación BDD con Gherkin`
- **Etiquetas**: `documentacion`, `prioridad-alta`
- **Miembro Asignado**: Juan David Monroy
- **Descripción**:
  ```markdown
  ### 🎯 Objetivo
  Crear la documentación técnica e institucional del proyecto BarberShop Pro, 
  formalizando los requisitos funcionales/no funcionales, historias de usuario 
  con criterios Gherkin y manual de gestión en Trello.

  ### 📋 Checklist de Entregables
  - [x] Redactar README.md institucional con arquitectura, stack y guía de ejecución.
  - [x] Redactar docs/especificacion.md con RF, RNF, HU-01 a HU-08 y criterios Gherkin.
  - [x] Redactar docs/guia-trello.md con estructura Kanban, DoD, DoR y convención Git.
  - [x] Ejecutar commit institucional y push a main:
        `git commit -m "docs: agregar README institucional, especificacion con criterios Gherkin y guia de Trello"`
  ```

### Ejemplo B: Tarjeta de Backend Core (Asignada a Elizabeth Ramirez)
- **Título**: `[BACK-01] Arquitectura Backend, Modelos Relacionales y Endpoints REST`
- **Etiquetas**: `backend`, `prioridad-alta`
- **Miembro Asignado**: Elizabeth Ramirez
- **Descripción**:
  ```markdown
  ### 🎯 Objetivo
  Configurar la arquitectura base de FastAPI con persistencia en SQLAlchemy, 
  modelos relacionales (Barberos, Servicios, Citas), algoritmo de solapamiento 
  de horarios y endpoints CRUD documentados en Swagger.

  ### 📋 Checklist Técnico
  - [x] Configurar FastAPI con lifespan, CORS y database.py.
  - [x] Diseñar modelos relacionales en models.py con ForeignKeys RESTRICT.
  - [x] Implementar DTOs con Pydantic v2 en schemas.py.
  - [x] Implementar algoritmo matemático anti-solapamiento en services.py.
  - [x] Crear script de seed.py con datos iniciales.
  - [x] Crear scripts .bat de arranque rápido en Windows.
  ```

### Ejemplo C: Tarjeta de Calidad y Pruebas (Asignada a Sebastian Orozco / Juan David Osorio)
- **Título**: `[QA-01] Suite de Pruebas Automatizadas y Reporte de Defectos Prevenidos`
- **Etiquetas**: `testing / qa`, `prioridad-alta`
- **Miembros Asignados**: Sebastian Orozco, Juan David Osorio
- **Descripción**:
  ```markdown
  ### 🎯 Objetivo
  Diseñar y ejecutar los casos de prueba formales (CP-01 a CP-09), verificar 
  tiempos de respuesta y documentar los defectos prevenidos en informe-calidad.md.

  ### 📋 Checklist Técnico
  - [x] Diseñar 9 casos de prueba formales cubriendo lógica de solapamiento.
  - [x] Documentar defectos prevenidos (DEF-001 solapamiento, DEF-002 validación catálogo, DEF-003 citas finalizadas).
  - [x] Elaborar docs/informe-calidad.md con métricas de calidad y mantenimiento.
  ```

---

## 7. Mapeo y Trazabilidad Git <-> Trello

Para mantener una auditoría clara entre las tareas de gestión en Trello y las contribuciones de código en GitHub, el equipo aplica las siguientes directrices:

### 7.1 Convención de Mensajes de Commit Semánticos
Cada commit debe reflejar con claridad el tipo de contribución:

- `feat(módulo):`: Nuevas funcionalidades implementadas (e.g. `feat(core): inicializar arquitectura del backend...`).
- `docs:`: Adición o actualización de documentación (e.g. `docs: agregar README institucional, especificacion con criterios Gherkin y guia de Trello`).
- `fix(módulo):`: Corrección de errores en lógica o validaciones.
- `refactor(módulo):`: Modificaciones en el código que no alteran el comportamiento funcional.
- `test:`: Adición o refactorización de pruebas unitarias o de integración.

### 7.2 Flujo de Trabajo en Git para Integración de Tareas
1. **Actualizar la copia local con la rama principal**:
   ```bash
   git pull origin main
   ```
2. **Realizar los cambios y agregar los archivos correspondientes**:
   ```bash
   git add README.md docs/especificacion.md docs/guia-trello.md
   ```
3. **Generar el commit institucional semántico**:
   ```bash
   git commit -m "docs: agregar README institucional, especificacion con criterios Gherkin y guia de Trello"
   ```
4. **Publicar los cambios en el repositorio remoto**:
   ```bash
   git push origin main
   ```
5. **Actualizar el Tablero de Trello**: Mover la tarjeta correspondiente a la columna **✅ Done**.

---

## 8. Asignación de Roles y Matriz de Responsabilidades (RACI)

| Actividad / Entregable | Elizabeth Ramirez (Líder / Backend) | Juan David Monroy (Docs & Requisitos) | Sebastian Orozco (Pruebas) | Juan David Osorio (Calidad) |
| :--- | :---: | :---: | :---: | :---: |
| Modelado de Base de Datos y ORM | **R / A** | C | C | I |
| Algoritmo de Turnos y Solapamiento | **R / A** | C | C | I |
| Especificación Formal de Requisitos (RF/RNF) | C | **R / A** | C | C |
| Historias de Usuario con Criterios Gherkin | C | **R / A** | C | C |
| README Institucional y Manuales | C | **R / A** | I | I |
| Guía Metodológica de Trello y Kanban | I | **R / A** | I | I |
| Diseño de Casos de Prueba (CP-01 a CP-09) | C | C | **R / A** | C |
| Registro de Defectos y Métricas de Calidad | C | C | C | **R / A** |

> **Leyenda RACI**:  
> **R (Responsible)**: Quien realiza la actividad.  
> **A (Accountable)**: Quien aprueba y responde por el resultado final.  
> **C (Consulted)**: Quien aporta información o valida aspectos específicos.  
> **I (Informed)**: Quien se mantiene informado del avance.
=======
# 📋 Guía Paso a Paso para Configurar el Tablero de Trello

Esta guía detalla la configuración exacta del tablero de Trello requerida por el docente Felipe Gutiérrez Isaza en la rúbrica del proyecto.

---

## 1. Crear el Tablero e Invitar al Docente
1. Entrar a [Trello](https://trello.com/) y crear un tablero con el nombre:  
   `BarberShop Pro - Cotecnova 2026-2`
2. En la opción **Compartir / Miembros**, invitar al correo del profesor Felipe.
3. Asegurarse de que el enlace sea accesible y copiar la URL en el `README.md`.

---

## 2. Configurar las Listas Obligatorias
El docente exige como mínimo estas 4 listas (de izquierda a derecha):
1. **Por hacer** (Backlog de tareas pendientes)
2. **En curso** (Tareas en desarrollo activo)
3. **En revisión** (Pull Requests abiertos o código pendiente de pruebas/calidad)
4. **Hecho** (Tareas completadas, mergeadas y con pruebas pasando)

---

## 3. Configurar las 4 Etiquetas (Labels) por Etapa
En el menú lateral de Trello $\rightarrow$ Etiquetas, crear o renombrar exactamente:
* 🟢 **Planeación** (Verde)
* 🟡 **Seguimiento 1** (Amarillo)
* 🟠 **Seguimiento 2** (Naranja)
* 🔴 **Entrega final** (Rojo)

---

## 4. Tarjetas Iniciales Sugeridas por Rol (Para Seguimiento 1)

Cada tarjeta debe tener:
* **Miembro asignado** (uno solo o principal responsable).
* **Fecha de vencimiento:** Lunes 2 de noviembre (11:59 p. m.).
* **Etiqueta:** `Seguimiento 1` (o `Planeación`).
* **Descripción breve** del resultado esperado.
* **Trazabilidad (Vital):** Cuando la terminen, agregar en la descripción o comentario el enlace al **commit de GitHub** o al archivo que la resolvió.

### 👤 Elizabeth Ramirez (Líder Técnico)
* **Tarjeta 1:** *Inicialización de arquitectura del repositorio y estructura de carpetas*
  * Etiqueta: `Planeación`
  * Descripción: Configurar la estructura `docs/`, `src/`, `tests/` y `.gitignore`.
* **Tarjeta 2:** *Diseño del modelo de datos de la base de datos (SQLAlchemy)*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Crear modelos de `Barbero`, `Servicio` y `Cita`.
* **Tarjeta 3:** *Lógica de control de solapamiento de horarios (RF-04)*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Algoritmo que valida que un barbero no tenga citas que se crucen el mismo día.

### 👤 Juan David Monroy (Documentación)
* **Tarjeta 1:** *Redacción de `README.md` institucional con roles y comandos*
  * Etiqueta: `Planeación`
  * Descripción: Incluir integrantes, roles, comandos de inicio y enlace a Trello.
* **Tarjeta 2:** *Elaboración de `docs/especificacion.md` con historias de usuario y Gherkin*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Documentar RF-01 al RF-06 con criterios de aceptación Dado/Cuando/Entonces.

### 👤 Juan David Osorio (Calidad)
* **Tarjeta 1:** *Auditoría de buenas prácticas y seguridad del repositorio*
  * Etiqueta: `Planeación`
  * Descripción: Validar que no se suban archivos `.env`, contraseñas ni credenciales reales.
* **Tarjeta 2:** *Definición de esquemas de validación de entrada con Pydantic v2*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Validar que precios sean $\ge 0$, duraciones $> 0$ y formatos de fecha/hora válidos.
* **Tarjeta 3:** *Creación de plantilla de informe de calidad (`docs/informe-calidad.md`)*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Estructurar formato para registro de defectos encontrados y métricas de código.

### 👤 Sebastian Orozco (Pruebas)
* **Tarjeta 1:** *Diseño de casos de prueba con técnicas formales (`docs/plan-de-pruebas.md`)*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Diseñar casos de partición de equivalencia y valores límite para solapamiento de turnos.
* **Tarjeta 2:** *Configuración del entorno de pruebas con `pytest` y SQLite en memoria*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Crear fixtures de prueba y base de datos aislada para testing.
* **Tarjeta 3:** *Automatización de pruebas unitarias de solapamiento de horarios*
  * Etiqueta: `Seguimiento 1`
  * Descripción: Escribir tests que verifiquen citas consecutivas, solapadas y en horarios distintos.
>>>>>>> origin/main
