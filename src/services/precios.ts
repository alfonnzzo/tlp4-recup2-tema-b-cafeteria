export function calcularTotal(precio: number, cantidad: number, propina: number): number {
  
  if (propina > 30 || propina < 0) {
    throw new RangeError('La propina debe ser un entero entre 0 y 30');
  }
  if (!Number.isInteger(propina) ) {
    throw new RangeError('La propina debe ser un entero entre 0 y 30');
  }
  const subtotal = precio * cantidad;
  const total = subtotal + (subtotal * propina) / 100;
  return Math.round(total * 100) / 100;
}