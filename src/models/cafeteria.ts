export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface NuevoPedido {
  cliente: string;
  productoId: number;
  cantidad: number;
  mesa: number;
  propina?: number;
}

export interface Pedido extends NuevoPedido {
  id: number;
  total: number;
}
