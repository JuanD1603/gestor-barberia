import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, Time, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Barbero(Base):
    __tablename__ = "barberos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    especialidad = Column(String(150), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    telefono = Column(String(20), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)

    # Relación uno a muchos con Citas
    citas = relationship("Cita", back_populates="barbero", cascade="all, delete-orphan")


class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    duracion_minutos = Column(Integer, nullable=False)  # Ej: 30, 45, 60
    precio = Column(Numeric(10, 2), nullable=False)    # Ej: 15.00
    activo = Column(Boolean, default=True, nullable=False)

    # Relación uno a muchos con Citas
    citas = relationship("Cita", back_populates="servicio")


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    codigo_reserva = Column(String(20), unique=True, index=True, nullable=False)
    
    # Claves foráneas (Integridad referencial RNF-01)
    barbero_id = Column(Integer, ForeignKey("barberos.id", ondelete="RESTRICT"), nullable=False)
    servicio_id = Column(Integer, ForeignKey("servicios.id", ondelete="RESTRICT"), nullable=False)
    
    # Datos del cliente
    cliente_nombre = Column(String(120), nullable=False)
    cliente_telefono = Column(String(25), nullable=False)
    cliente_email = Column(String(120), nullable=True)

    # Horario de la reserva
    fecha = Column(Date, nullable=False, index=True)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)

    # Estado: 'Pendiente', 'En curso', 'Finalizada', 'Cancelada'
    estado = Column(String(30), default="Pendiente", nullable=False, index=True)
    notas = Column(Text, nullable=True)
    creada_el = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)

    # Relaciones ORM
    barbero = relationship("Barbero", back_populates="citas")
    servicio = relationship("Servicio", back_populates="citas")
