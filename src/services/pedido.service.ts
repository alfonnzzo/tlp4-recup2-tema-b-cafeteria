import { NoEncontradoError, StockInsuficienteError } from '../errors';
import type { NuevoPedido, Pedido, Producto } from '../models/cafeteria';
import type { CafeteriaRepository } from '../repositories/cafeteria.repository';
import { calcularTotal } from './precios';
import { validarNuevoPedido } from './validaciones';

export class PedidoService {
  constructor(private readonly repo: CafeteriaRepository) {}

  listarProductos(): Producto[] {
    return this.repo.listar();
  }

  obtenerProducto(id: number): Producto {
    const producto = this.repo.buscarPorId(id);
    if (!producto) {
      throw new NoEncontradoError(`No existe el producto ${id}`);
    }
    return producto;
  }

  crear(datos: NuevoPedido): Pedido {
    validarNuevoPedido(datos);
    const producto = this.obtenerProducto(datos.productoId);
    if (datos.cantidad > producto.stock) {
      throw new StockInsuficienteError(
        `Stock insuficiente: hay ${producto.stock} unidades y se pidieron ${datos.cantidad}`,
      );
    }
    const total = calcularTotal(producto.precio, datos.cantidad, datos.propina ?? 0);
    this.repo.actualizar({ ...producto, stock: producto.stock - datos.cantidad });
    return this.repo.guardarPedido({ ...datos, total });
  }
}
