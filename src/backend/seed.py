import sys
from decimal import Decimal
from database import SessionLocal, engine, Base
import models


def poblar_datos_iniciales():
    # Asegurar que las tablas existan
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Verificar si ya existen barberos
        if db.query(models.Barbero).count() == 0:
            barberos = [
                models.Barbero(
                    nombre="Mateo 'El Maestro' Sánchez",
                    especialidad="Especialista en Fade, Degradados y Navaja Tradicional",
                    email="mateo@barbershop.pro",
                    telefono="3101234567",
                    activo=True
                ),
                models.Barbero(
                    nombre="Carlos 'The Beard' Delgado",
                    especialidad="Especialista en Barba Spa y Cuidado Facial Premium",
                    email="carlos@barbershop.pro",
                    telefono="3119876543",
                    activo=True
                ),
                models.Barbero(
                    nombre="Lucas 'Urban' Romero",
                    especialidad="Especialista en Colorimetría, Platinados y Diseños Urbanos",
                    email="lucas@barbershop.pro",
                    telefono="3125558899",
                    activo=True
                )
            ]
            db.add_all(barberos)
            print("Barberos iniciales agregados.")

        # 2. Verificar si ya existen servicios
        if db.query(models.Servicio).count() == 0:
            servicios = [
                models.Servicio(
                    nombre="Corte Clásico",
                    descripcion="Corte tradicional con tijera o máquina, lavado y peinado.",
                    duracion_minutos=30,
                    precio=Decimal("15.00"),
                    activo=True
                ),
                models.Servicio(
                    nombre="Barba Spa",
                    descripcion="Toalla caliente, perfilado con navaja, aceites esenciales e hidratación.",
                    duracion_minutos=30,
                    precio=Decimal("12.00"),
                    activo=True
                ),
                models.Servicio(
                    nombre="Combo Corte + Barba",
                    descripcion="Experiencia completa: corte de cabello y arreglo de barba premium.",
                    duracion_minutos=45,
                    precio=Decimal("22.00"),
                    activo=True
                ),
                models.Servicio(
                    nombre="Perfilado y Cejas",
                    descripcion="Limpieza de contornos, nuca y diseño de cejas a navaja.",
                    duracion_minutos=30,
                    precio=Decimal("8.00"),
                    activo=True
                ),
                models.Servicio(
                    nombre="Colorimetría y Platinado",
                    descripcion="Decoloración global o mechas platinadas con matizado protector.",
                    duracion_minutos=45,
                    precio=Decimal("35.00"),
                    activo=True
                )
            ]
            db.add_all(servicios)
            print("Servicios iniciales agregados.")

        db.commit()
        print("Base de datos poblada exitosamente.")

    except Exception as e:
        db.rollback()
        print(f"Error al poblar la base de datos: {e}", file=sys.stderr)
    finally:
        db.close()


if __name__ == "__main__":
    poblar_datos_iniciales()
