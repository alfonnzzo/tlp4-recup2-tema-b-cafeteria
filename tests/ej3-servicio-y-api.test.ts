import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { crearApp } from '../src/app';
import { ValidacionError } from '../src/errors';
import type { NuevoPedido } from '../src/models/cafeteria';
import type { CafeteriaRepository } from '../src/repositories/cafeteria.repository';
import { PedidoService } from '../src/services/pedido.service';

function crearRepositorioFalso() {
  return {
    listar: vi.fn(() => []),
    buscarPorId: vi.fn(() => ({ id: 1, nombre: 'Café con leche', precio: 1500, stock: 10 })),
    actualizar: vi.fn(),
    guardarPedido: vi.fn((datos: NuevoPedido & { total: number }) => ({ id: 99, ...datos })),
  } satisfies CafeteriaRepository;
}

describe('Ej. 3a - PedidoService.crear con un repositorio falso', () => {
  it.todo('con datos válidos llama a actualizar una sola vez, con el stock descontado');
  it.todo('con datos inválidos lanza ValidacionError y NO llama a actualizar');
});

describe('Ej. 3b - API /pedidos', () => {
  it('GET /productos responde 200 con la lista de productos', async () => {
    const respuesta = await request(crearApp()).get('/productos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(3);
  });

  it.todo('POST /pedidos con datos válidos responde 201 con el pedido creado');
  it.todo('POST /pedidos con un producto que no existe responde 404 con un mensaje de error');
});
