# 💈 BarberShop Pro — Sistema de Gestión y Agendamiento de Citas

Proyecto final para el curso de **Ingeniería de Software II** (Código 17934) — **Cotecnova**  
Docente: **Felipe Gutiérrez Isaza**  
Periodo: **2026-2**

---

## 👥 Equipo y Asignación de Roles

| Integrante | Rol en el Proyecto | Responsabilidad Principal |
|---|---|---|
| **Elizabeth Ramirez** | **Líder Técnico** | Coordina el alcance, la arquitectura, el modelo de datos y la integración continua del repositorio. |
| **Sebastian Orozco** | **Responsable de Pruebas** | Diseña los casos de prueba formales, técnicas de partición/valores límite y coordina la automatización con `pytest`. |
| **Juan David Osorio** | **Responsable de Calidad** | Revisa estándares de código, registra defectos/riesgos, propone acciones de mantenimiento y métricas de calidad. |
| **Juan David Monroy** | **Responsable de Documentación** | Mantiene la especificación de requisitos, criterios de aceptación, actas, manuales y evidencias de entregas. |

---

## 📌 Gestión del Proyecto en Trello

El seguimiento ágil del proyecto, la asignación de tarjetas y la trazabilidad de tareas hacia los commits del repositorio se gestionan a través de:
* **Enlace al Tablero de Trello:** [Tablero Oficial - BarberShop Pro](https://trello.com/b/ENLACE_DEL_TABLERO_AQUI) *(Pendiente por actualizar enlace una vez invitado el docente)*

---

## 🏛️ Estructura del Repositorio

El repositorio respeta estrictamente los lineamientos solicitados para el curso:

```text
gestor-barberia/
├── README.md                 # Integrantes, roles, guía de ejecución y enlace a Trello
├── .gitignore                # Exclusión de archivos sensibles, temporales y dependencias
├── docs/                     # Documentación de ingeniería de software
│   ├── especificacion.md     # Requisitos funcionales y criterios de aceptación (Gherkin)
│   ├── diagramas-uml.md      # Especificación completa de diagramas UML (UML 2.5 / ISO 19505)
│   ├── diagramas/            # Fuentes Mermaid (.mmd) e imágenes compiladas (.png y .svg)
│   ├── plan-de-pruebas.md    # Casos de prueba diseñados (partición de equivalencia, límites)
│   └── informe-calidad.md    # Registro de defectos, métricas y acciones de mantenimiento
├── src/                      # Código fuente de la aplicación
│   ├── backend/              # API REST con FastAPI, SQLAlchemy 2.0 y Pydantic v2
│   └── frontend/             # Interfaz de usuario con React, Vite y Tailwind CSS
└── tests/                    # Pruebas automatizadas (unitarias e integración con pytest)
```

---

## Diagramas de Arquitectura y Diseno UML (ISO/IEC 19505)

El sistema cuenta con una especificacion de 10 diagramas modelados en UML 2.5 y compilados en alta resolucion (PNG escala x2 y SVG vectorial) dentro de `docs/diagramas/`. Para una revision exhaustiva de cada modelo, consultar [docs/diagramas-uml.md](docs/diagramas-uml.md):

1. **Diagrama de Casos de Uso del Sistema:** Limites de actores (`Cliente`, `Barbero`, `Administrador`) y relaciones de inclusion/extension.
2. **Diagrama de Clases del Dominio y Servicios:** Modelo estatico orientado a objetos con atributos, operaciones y dependencias.
3. **Diagrama Entidad-Relacion (Modelo Relacional):** Tablas relacionales, tipos SQL, claves primarias, foraneas e indices.
4. **Diagrama de Secuencia - Agendamiento Multaservicio:** Flujo de reserva con validacion de limites y confirmacion por correo.
5. **Diagrama de Secuencia - Gestion de Inasistencia y Suspension:** Flujo de evaluacion de politicas de suspension automatica (PN-10).
6. **Diagrama de Secuencia - Reprogramacion con Politicas:** Regla de unica reprogramacion permitida y ventana de anticipacion de 12 horas.
7. **Diagrama de Estados:** Maquinas de estados para el ciclo de vida de Citas y Cuentas de Usuario.
8. **Diagrama de Componentes:** Arquitectura en capas limpias (Presentacion, API, Dominio, Persistencia y Notificaciones).
9. **Diagrama de Despliegue:** Nodos cliente, servidor web frontend, servidor de aplicacion ASGI y motor de base de datos.
10. **Diagrama de Paquetes:** Modularizacion y desacoplamiento segun estandares ISO/IEC 12207.

---

## 🚀 Stack Tecnológico

| Capa | Tecnologías Seleccionadas |
|---|---|
| **Backend** | Python 3.11+ / 3.13, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy 2.0 |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Base de Datos** | MySQL 8 / MariaDB (Producción/Dev) y SQLite (Entorno de pruebas automatizadas) |
| **Testing / Calidad**| `pytest`, `pytest-asyncio`, `httpx` (TestClient de FastAPI) |

---

## ⚡ Guía de Instalación y Ejecución Local

### Prerrequisitos
* Python 3.11 o superior instalado (`python --version`)
* Node.js v18 o superior instalado (`node --version`)
* Git instalado (`git --version`)

---

### 1. Configuración del Backend (FastAPI)

1. Abrir una terminal y navegar al directorio del backend:
   ```bash
   cd src/backend
   ```

2. Crear y activar el entorno virtual de Python:
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instalar las dependencias necesarias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar las variables de entorno:
   * Copiar el archivo de plantilla `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   *(Ajustar las credenciales en caso de usar un servidor MySQL local, o usar la cadena de SQLite para pruebas rápidas).*

5. Iniciar el servidor de desarrollo:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * **API Base:** `http://127.0.0.1:8000`
   * **Documentación interactiva Swagger / OpenAPI:** `http://127.0.0.1:8000/docs`

---

### 2. Ejecución de Pruebas Automatizadas

Para validar los casos de prueba unitarios y de lógica de negocio (como detección de choques de horario y cálculo de disponibilidad):

```bash
# Estando en la raíz del proyecto o en src/backend con el entorno virtual activo:
pytest tests/ -v
```

---

### 3. Configuración del Frontend (React + Vite)

1. En una nueva terminal, navegar al directorio del frontend:
   ```bash
   cd src/frontend
   ```

2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```

3. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
   * **Aplicación Web:** `http://localhost:5173`

---

## 🏷️ Historial de Entregas y Tags

* **Seguimiento 1:** `git tag entrega-s1`
* **Seguimiento 2:** `git tag entrega-s2`
* **Entrega Final:** `git tag entrega-final`

## Pasos para abrirlo desde cmd 
```cmd
cd Desktop
cd gestor-barberia-version-1.1
iniciar-backend.bat
iniciar-frontend.bat
```
