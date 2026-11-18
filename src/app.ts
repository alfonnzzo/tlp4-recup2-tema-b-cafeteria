import express from 'express';
import { CafeteriaController } from './controllers/cafeteria.controller';
import { productosIniciales } from './data/productos-iniciales';
import { manejarErrores } from './middlewares/manejo-errores';
import { type CafeteriaRepository, CafeteriaRepositoryEnMemoria } from './repositories/cafeteria.repository';
import { crearCafeteriaRouter } from './routes/cafeteria.routes';
import { PedidoService } from './services/pedido.service';

export function crearApp(repo: CafeteriaRepository = new CafeteriaRepositoryEnMemoria(productosIniciales)) {
  const app = express();
  app.use(express.json());

  const service = new PedidoService(repo);
  const controller = new CafeteriaController(service);

  app.use('/', crearCafeteriaRouter(controller));
  app.use(manejarErrores);
  return app;
}
