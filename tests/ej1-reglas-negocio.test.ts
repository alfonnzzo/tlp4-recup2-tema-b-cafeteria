import { describe, expect, it } from 'vitest';
import { StockInsuficienteError } from '../src/errors';
import { CafeteriaRepositoryEnMemoria } from '../src/repositories/cafeteria.repository';
import { PedidoService } from '../src/services/pedido.service';
import { calcularTotal } from '../src/services/precios';

describe('Ej. 1 - calcularTotal', () => {
  it('sin propina cobra precio × cantidad', () => {
    expect(calcularTotal(1500, 2, 0)).toBe(3000);
  });

  it('agrega una propina del 10 %', () => {
    expect(calcularTotal(1500, 2, 10)).toBe(3300);
  });

  it('redondea el resultado a 2 decimales', () => {
    expect(calcularTotal(1234.56, 1, 15)).toBe(1419.74);
  });

  it('acepta una propina del 0 %', () => {
    expect(() => calcularTotal(1500, 2, 0)).not.toThrow();
  });

  it('rechaza una propina mayor al 30 %', () => {
    expect(() => calcularTotal(1500, 2, 35)).toThrow(RangeError);
  });

  it('rechaza una propina negativa', () => {
    expect(() => calcularTotal(1500, 2, -5)).toThrow(RangeError);
  });

  it('rechaza una propina con decimales', () => {
    expect(() => calcularTotal(1500, 2, 12.5)).toThrow(RangeError);
  });
});

describe('Ej. 1 - PedidoService.crear', () => {
  const crearServicio = () =>
    new PedidoService(
      new CafeteriaRepositoryEnMemoria([{ id: 1, nombre: 'Café con leche', precio: 1500, stock: 10 }]),
    );
  const pedido = { cliente: 'Ana', productoId: 1, mesa: 4 };

  it('descuenta del stock la cantidad pedida', () => {
    const servicio = crearServicio();
    servicio.crear({ ...pedido, cantidad: 3 });
    expect(servicio.obtenerProducto(1).stock).toBe(7);
  });

  it('permite pedir exactamente el stock disponible', () => {
    const servicio = crearServicio();
    servicio.crear({ ...pedido, cantidad: 10 });
    expect(servicio.obtenerProducto(1).stock).toBe(0);
  });

  it('rechaza pedir más que el stock disponible', () => {
    const servicio = crearServicio();
    expect(() => servicio.crear({ ...pedido, cantidad: 11 })).toThrow(StockInsuficienteError);
  });
});
