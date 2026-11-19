import datetime
import pytest
from fastapi import status
import models
from helpers import hora


@pytest.fixture
def setup_datos_base(barbero, otro_barbero, corte):
    """Fixture de retrocompatibilidad para los casos CP-01 a CP-09 del Seguimiento 1."""
    return {
        "barbero1": barbero,
        "barbero2": otro_barbero,
        "servicio": corte
    }


def test_cp01_crear_servicio_valido(client, h_admin):
    """CP-01: Registro exitoso de un servicio con valores válidos por administrador (HTTP 201)."""
    payload = {
        "nombre": "Afeitado Clásico Especial",
        "descripcion": "Afeitado con toalla caliente",
        "duracion_minutos": 30,
        "precio": "12500",
        "activo": True
    }
    response = client.post("/api/admin/servicios", json=payload, headers=h_admin)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["id"] is not None
    assert data["nombre"] == "Afeitado Clásico Especial"
    assert float(data["precio"]) == 12500.0


def test_cp02_crear_servicio_precio_negativo_falla(client, h_admin):
    """CP-02: Rechazo por validación Pydantic de precio negativo (HTTP 422)."""
    payload = {
        "nombre": "Servicio Inválido",
        "duracion_minutos": 30,
        "precio": "-1000"
    }
    response = client.post("/api/admin/servicios", json=payload, headers=h_admin)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_cp03_crear_servicio_duracion_cero_falla(client, h_admin):
    """CP-03: Rechazo por validación Pydantic de duración igual o menor a cero (HTTP 422)."""
    payload = {
        "nombre": "Servicio Sin Tiempo",
        "duracion_minutos": 0,
        "precio": "15000"
    }
    response = client.post("/api/admin/servicios", json=payload, headers=h_admin)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_cp04_agendar_cita_horario_libre(client, h_cliente, setup_datos_base, reloj):
    """CP-04: Agendamiento de cita en horario libre con cálculo automático de hora_fin (HTTP 201)."""
    barbero = setup_datos_base["barbero1"]
    servicio = setup_datos_base["servicio"]  # duración: 30 min
    fecha_futura = reloj.en(1)

    payload = {
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "10:00"
    }

    response = client.post("/api/citas", json=payload, headers=h_cliente)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["codigo_reserva"].startswith("BSP-")
    assert data["hora_inicio"].startswith("10:00")
    assert data["hora_fin"].startswith("10:30")
    assert data["estado"] == "Programada"


def test_cp05_agendar_citas_consecutivas_permitidas(client, h_cliente, h_otro_cliente, setup_datos_base, reloj):
    """
    CP-05: Valor límite de frontera.
    Cita 1: 10:00 a 10:30.
    Cita 2: 10:30 a 11:00.
    Deben permitirse sin colisión ya que no se solapan (HTTP 201).
    """
    barbero = setup_datos_base["barbero1"]
    servicio = setup_datos_base["servicio"]
    fecha_futura = reloj.en(1)

    # Cita 1
    c1 = client.post("/api/citas", headers=h_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "10:00"
    })
    assert c1.status_code == status.HTTP_201_CREATED

    # Cita 2 (arranca exactamente cuando termina la anterior)
    c2 = client.post("/api/citas", headers=h_otro_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "10:30"
    })
    assert c2.status_code == status.HTTP_201_CREATED
    assert c2.json()["hora_inicio"].startswith("10:30")
    assert c2.json()["hora_fin"].startswith("11:00")


def test_cp06_agendar_cita_solapada_falla(client, h_cliente, h_otro_cliente, setup_datos_base, reloj):
    """
    CP-06: Conflicto de solapamiento de horario.
    Cita 1: 10:00 a 10:30.
    Cita 2: 10:00 a 10:30 con el mismo barbero.
    Debe responder HTTP 409 Conflict.
    """
    barbero = setup_datos_base["barbero1"]
    servicio = setup_datos_base["servicio"]
    fecha_futura = reloj.en(1)

    # Cita 1
    c1 = client.post("/api/citas", headers=h_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "10:00"
    })
    assert c1.status_code == status.HTTP_201_CREATED

    # Cita 2 en conflicto
    c2 = client.post("/api/citas", headers=h_otro_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "10:00"
    })
    assert c2.status_code == status.HTTP_409_CONFLICT


def test_cp07_agendar_mismo_horario_diferente_barbero_permitido(client, h_cliente, h_otro_cliente, setup_datos_base, reloj):
    """CP-07: Dos barberos distintos pueden tener citas al mismo tiempo sin interferencia (HTTP 201)."""
    barbero1 = setup_datos_base["barbero1"]
    barbero2 = setup_datos_base["barbero2"]
    servicio = setup_datos_base["servicio"]
    fecha_futura = reloj.en(1)

    # Barbero 1 a las 11:00
    c1 = client.post("/api/citas", headers=h_cliente, json={
        "barbero_id": barbero1.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "11:00"
    })
    assert c1.status_code == status.HTTP_201_CREATED

    # Barbero 2 a las 11:00 (mismo horario, otro profesional)
    c2 = client.post("/api/citas", headers=h_otro_cliente, json={
        "barbero_id": barbero2.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "11:00"
    })
    assert c2.status_code == status.HTTP_201_CREATED


def test_cp08_cancelacion_cita_libera_horario(client, h_cliente, h_otro_cliente, setup_datos_base, reloj):
    """CP-08: Cancelar una cita libera el horario para que otro cliente pueda agendar (HTTP 200 y HTTP 201)."""
    barbero = setup_datos_base["barbero1"]
    servicio = setup_datos_base["servicio"]
    fecha_futura = reloj.en(2)  # más de 12 horas para cumplir política de cancelación

    # Cita original
    c1 = client.post("/api/citas", headers=h_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "15:00"
    })
    assert c1.status_code == status.HTTP_201_CREATED
    cita_id = c1.json()["id"]

    # Cancelar la cita con anticipación válida
    cancel = client.post(f"/api/citas/{cita_id}/cancelar", headers=h_cliente)
    assert cancel.status_code == status.HTTP_200_OK

    # Ahora otro cliente puede agendar exactamente ese mismo horario
    c2 = client.post("/api/citas", headers=h_otro_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "15:00"
    })
    assert c2.status_code == status.HTTP_201_CREATED


def test_cp09_cita_cancelada_no_puede_modificarse(client, h_cliente, setup_datos_base, reloj):
    """CP-09: Una cita cancelada es un estado terminal que no admite nuevas cancelaciones ni reprogramaciones."""
    barbero = setup_datos_base["barbero1"]
    servicio = setup_datos_base["servicio"]
    fecha_futura = reloj.en(2)

    c1 = client.post("/api/citas", headers=h_cliente, json={
        "barbero_id": barbero.id,
        "servicios_ids": [servicio.id],
        "fecha": fecha_futura.isoformat(),
        "hora_inicio": "16:00"
    })
    cita_id = c1.json()["id"]

    # Primera cancelación
    assert client.post(f"/api/citas/{cita_id}/cancelar", headers=h_cliente).status_code == status.HTTP_200_OK

    # Segunda cancelación o intento de alteración -> Debe fallar (HTTP 409 o 422)
    reintentar = client.post(f"/api/citas/{cita_id}/cancelar", headers=h_cliente)
    assert reintentar.status_code in (status.HTTP_409_CONFLICT, status.HTTP_422_UNPROCESSABLE_ENTITY, status.HTTP_400_BAD_REQUEST)
