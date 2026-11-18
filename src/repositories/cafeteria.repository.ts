import type { NuevoPedido, Pedido, Producto } from '../models/cafeteria';

export interface CafeteriaRepository {
  listar(): Producto[];
  buscarPorId(id: number): Producto | undefined;
  actualizar(producto: Producto): void;
  guardarPedido(datos: NuevoPedido & { total: number }): Pedido;
}

export class CafeteriaRepositoryEnMemoria implements CafeteriaRepository {
  private productos: Producto[];
  private pedidos: Pedido[] = [];

  constructor(iniciales: Producto[] = []) {
    this.productos = iniciales.map((p) => ({ ...p }));
  }

  listar(): Producto[] {
    return this.productos.map((p) => ({ ...p }));
  }

  buscarPorId(id: number): Producto | undefined {
    const producto = this.productos.find((p) => p.id === id);
    return producto ? { ...producto } : undefined;
  }

  actualizar(producto: Producto): void {
    const indice = this.productos.findIndex((p) => p.id === producto.id);
    if (indice !== -1) {
      this.productos[indice] = { ...producto };
    }
  }

  guardarPedido(datos: NuevoPedido & { total: number }): Pedido {
    const pedido: Pedido = { id: this.pedidos.length + 1, ...datos };
    this.pedidos.push(pedido);
    return { ...pedido };
  }
}
