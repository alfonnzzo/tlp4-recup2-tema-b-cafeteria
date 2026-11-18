import { describe, expect, it } from 'vitest';
import { ValidacionError } from '../src/errors';
import { validarNuevoPedido } from '../src/services/validaciones';

const valido = { cliente: 'Ana', productoId: 1, cantidad: 2, mesa: 4 };

describe('Ej. 2 - validarNuevoPedido', () => {

  it('La cantidad debe ser un número entero mayor o igual a 1.', () => {
    expect(() => validarNuevoPedido({...valido, cantidad: 1 })).not.toThrow();
  });

  it('solo puede tener 1 caracter', () => {
    expect(() => validarNuevoPedido({...valido, cliente: "A"})).not.toThrow();
  });

  it('acepta un pedido con datos válidos', () => {
    expect(() => validarNuevoPedido(valido)).not.toThrow();
  });

  it('rechaza un cliente que contiene solo espacios', () => {
    expect(() => validarNuevoPedido({ ...valido, cliente: '   ' })).toThrow(ValidacionError);
  });

  it('rechaza una cantidad igual a cero', () => {
    expect(() => validarNuevoPedido({ ...valido, cantidad: 0 })).toThrow(ValidacionError);
  });

  it('rechaza una mesa mayor a 20', () => {
    expect(() => validarNuevoPedido({ ...valido, mesa: 21 })).toThrow(ValidacionError);
  });
});
