import type { Request, Response } from 'express';
import type { PedidoService } from '../services/pedido.service';

export class CafeteriaController {
  constructor(private readonly service: PedidoService) {}

  listarProductos = (_req: Request, res: Response) => {
    res.json(this.service.listarProductos());
  };

  obtenerProducto = (req: Request, res: Response) => {
    res.json(this.service.obtenerProducto(Number(req.params.id)));
  };

  crearPedido = (req: Request, res: Response) => {
    const pedido = this.service.crear(req.body);
    res.status(201).json(pedido);
  };
}
