import { ValidacionError } from '../errors';
import type { NuevoPedido } from '../models/cafeteria';

export function validarNuevoPedido(datos: NuevoPedido): void {
  if (typeof datos.cliente !== 'string' || datos.cliente.trim() === '') {
    throw new ValidacionError('El cliente es obligatorio');
  }

  if (typeof datos.cantidad !== 'number' || !Number.isInteger(datos.cantidad) || datos.cantidad < 1) {
    throw new ValidacionError('La cantidad debe ser un número entero mayor o igual a 1');
  }
  if (typeof datos.mesa !== 'number' || !Number.isInteger(datos.mesa) || datos.mesa < 1 || datos.mesa > 20) {
    throw new ValidacionError('La mesa debe ser un número entero entre 1 y 20');
  }
}
