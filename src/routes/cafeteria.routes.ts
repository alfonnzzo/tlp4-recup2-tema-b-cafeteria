import { Router } from 'express';
import type { CafeteriaController } from '../controllers/cafeteria.controller';

export function crearCafeteriaRouter(controller: CafeteriaController): Router {
  const router = Router();
  router.get('/productos', controller.listarProductos);
  router.get('/productos/:id', controller.obtenerProducto);
  router.post('/pedidos', controller.crearPedido);
  return router;
}
