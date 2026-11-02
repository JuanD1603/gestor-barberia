import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict


# ==========================================
# Esquemas para Barberos
# ==========================================
class BarberoBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre completo del barbero")
    especialidad: str = Field(..., min_length=3, max_length=150, description="Especialidad técnica")
    email: EmailStr = Field(..., description="Correo electrónico institucional único")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono de contacto")
    activo: bool = Field(default=True, description="Indica si el barbero está disponible")

    @field_validator("nombre", "especialidad")
    @classmethod
    def validar_no_espacios_blanco(cls, v: str) -> str:
        v_strip = v.strip()
        if not v_strip:
            raise ValueError("El campo no puede estar vacío ni contener solo espacios.")
        return v_strip


class BarberoCreate(BarberoBase):
    pass


class BarberoResponse(BarberoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Esquemas para Servicios (Control de Calidad: Precios y Duraciones)
# ==========================================
class ServicioBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=255)
    duracion_minutos: int = Field(..., gt=0, le=240, description="Duración en minutos (debe ser mayor a 0 y hasta 4 horas)")
    precio: Decimal = Field(..., ge=0, description="Precio del servicio (no puede ser negativo)")
    activo: bool = Field(default=True)

    @field_validator("nombre")
    @classmethod
    def validar_nombre_servicio(cls, v: str) -> str:
        v_strip = v.strip()
        if not v_strip:
            raise ValueError("El nombre del servicio es obligatorio.")
        return v_strip


class ServicioCreate(ServicioBase):
    pass


class ServicioResponse(ServicioBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Esquemas para Citas (Control de Calidad: Fechas, Horas y Estados)
# ==========================================
class CitaCreate(BaseModel):
    barbero_id: int = Field(..., gt=0, description="Identificador del barbero")
    servicio_id: int = Field(..., gt=0, description="Identificador del servicio")
    cliente_nombre: str = Field(..., min_length=2, max_length=120)
    cliente_telefono: str = Field(..., min_length=7, max_length=25)
    cliente_email: Optional[EmailStr] = None
    fecha: datetime.date = Field(..., description="Fecha de la reserva (AAAA-MM-DD)")
    hora_inicio: datetime.time = Field(..., description="Hora de inicio deseada (HH:MM)")
    notas: Optional[str] = Field(None, max_length=500)

    @field_validator("cliente_nombre", "cliente_telefono")
    @classmethod
    def validar_campos_texto(cls, v: str) -> str:
        v_strip = v.strip()
        if not v_strip:
            raise ValueError("El campo no puede estar vacío.")
        return v_strip


class CitaEstadoUpdate(BaseModel):
    estado: str = Field(..., description="Nuevo estado de la cita")

    @field_validator("estado")
    @classmethod
    def validar_transicion_estado(cls, v: str) -> str:
        estados_validos = {"Pendiente", "En curso", "Finalizada", "Cancelada"}
        if v not in estados_validos:
            raise ValueError(f"Estado '{v}' no es válido. Estados permitidos: {', '.join(sorted(estados_validos))}")
        return v


class CitaResponse(BaseModel):
    id: int
    codigo_reserva: str
    barbero_id: int
    servicio_id: int
    cliente_nombre: str
    cliente_telefono: str
    cliente_email: Optional[str]
    fecha: datetime.date
    hora_inicio: datetime.time
    hora_fin: datetime.time
    estado: str
    notas: Optional[str]
    creada_el: datetime.datetime
    barbero: Optional[BarberoResponse] = None
    servicio: Optional[ServicioResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Esquema para Disponibilidad de Horarios
# ==========================================
class SlotHorario(BaseModel):
    hora_inicio: str
    hora_fin: str
    disponible: bool
    motivo: Optional[str] = None
