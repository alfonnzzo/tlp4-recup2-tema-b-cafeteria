# TLP IV · Recuperatorio del 2.º parcial · Parte práctica · **TEMA B**

API REST de **pedidos de una cafetería** hecha con Express + TypeScript y probada con Vitest + supertest.
La parte práctica evalúa **solo testing**: vas a leer tests, interpretar fallas, escribir tests nuevos y corregir el código que esos tests revelen como defectuoso.

> **No está permitido usar asistentes de IA.**
> Antes de empezar, completá tus datos en `RESPUESTAS.md`.

---

## 1. Puesta en marcha

Requisito: Node.js 20 o superior.

```bash
npm install          # instala dependencias
npm test             # ejecuta todos los tests una vez
npm run test:watch   # ejecuta los tests y los repite al guardar cambios
npm run typecheck    # verifica los tipos con tsc (sin generar .js)
npm run dev          # levanta la API en http://localhost:3000 (opcional)
```

Al ejecutar `npm test` por primera vez **vas a ver tests que fallan**. Es parte del examen.

## 2. Estructura del proyecto (arquitectura en capas)

```
src/
├── app.ts                                  # arma la app de Express (se usa en los tests)
├── server.ts                               # levanta el servidor
├── routes/cafeteria.routes.ts              # rutas HTTP
├── controllers/cafeteria.controller.ts     # capa de presentación: HTTP <-> servicio
├── services/
│   ├── pedido.service.ts                   # capa de negocio
│   ├── precios.ts                          # calcularTotal()
│   └── validaciones.ts                     # validarNuevoPedido()
├── repositories/cafeteria.repository.ts    # interfaz CafeteriaRepository + implementación en memoria
├── middlewares/manejo-errores.ts           # traduce errores del dominio a códigos HTTP
├── models/cafeteria.ts
├── data/productos-iniciales.ts
└── errors.ts                               # ValidacionError, NoEncontradoError, StockInsuficienteError
tests/
├── ej1-reglas-negocio.test.ts
├── ej2-validaciones.test.ts
└── ej3-servicio-y-api.test.ts
```

No hay base de datos: el repositorio guarda los productos y los pedidos en memoria. Cada llamada a `crearApp()` arranca con los 3 productos de `data/productos-iniciales.ts`.

## 3. Endpoints

| Método | Ruta               | Descripción                                                                                                  |
| ------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| GET     | `/productos`     | Lista todos los productos                                                                                     |
| GET     | `/productos/:id` | Devuelve un producto (404 si no existe)                                                                       |
| POST    | `/pedidos`       | Crea un pedido y descuenta el stock del producto. Body: `{ cliente, productoId, cantidad, mesa, propina? }` |

Los errores se responden con el formato `{ "error": "mensaje" }`.

## 4. Reglas de negocio

Estas reglas son **el requisito**. Ante cualquier duda entre lo que dice un test, lo que hace el código y lo que dice esta tabla, manda esta tabla.

| Regla        | Descripción                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | Total del pedido = precio × cantidad, más la propina: subtotal + subtotal × propina / 100, redondeado a 2 decimales. Si no se indica propina, es 0.                          |
| **R2** | La propina debe ser un número **entero** entre 0 y 30, **ambos inclusive**. Una propina del 0 % es válida. Fuera de eso, `calcularTotal` lanza `RangeError`.  |
| **R3** | Se puede pedir una cantidad **menor o igual** al stock disponible del producto. Si se pide más, se lanza `StockInsuficienteError`. El stock nunca queda negativo.      |
| **R4** | El cliente es obligatorio: no puede estar vacío ni contener solo espacios.                                                                                                     |
| **R5** | La cantidad debe ser un número **entero** mayor o igual a 1.                                                                                                             |
| **R6** | La mesa debe ser un número **entero** entre 1 y 20, ambos inclusive.                                                                                                     |
| **R7** | La API responde **400** ante datos inválidos (`ValidacionError` o `RangeError`), **404** si el producto no existe y **409** si el stock es insuficiente. |

R4, R5 y R6 se validan en `validarNuevoPedido`; si una no se cumple, se lanza `ValidacionError`.

---

## 5. Consigna

Se aprueba la parte práctica resolviendo correctamente **al menos 2 de los 3 ejercicios**.

### Ejercicio 1 · Interpretar fallas y corregir

Archivo: `tests/ej1-reglas-negocio.test.ts`

1. Ejecutá `npm test` y observá qué tests del Ej. 1 fallan.
2. Para **cada** test que falla, decidí dónde está el error: **en el código** o **en el test**. Usá las reglas de negocio de la sección 4 como criterio. *No todos los fallos se deben al código.*
3. Corregí lo que corresponda (el código en `src/` o el test) hasta que todos los tests del Ej. 1 pasen.
4. En `RESPUESTAS.md`, completá la tabla del Ej. 1: test, dónde estaba el error y por qué (citando la regla).

> Si el error está en el código, **no** modifiques el test para que pase.

### Ejercicio 2 · Casos límite e inválidos

Archivo: `tests/ej2-validaciones.test.ts`

La función `validarNuevoPedido` (`src/services/validaciones.ts`) tiene un solo test.

1. Escribí tests que cubran las reglas **R4, R5 y R6**. Como mínimo:
   - **dos casos límite** (valores justo en el borde de una regla),
   - **tres casos inválidos**, al menos uno por cada regla.
2. Si algún test que escribiste revela un defecto, **corregí el código** de `validaciones.ts` (no el test).
3. En `RESPUESTAS.md`, indicá qué defectos encontraste.

### Ejercicio 3 · Dobles de prueba y prueba de integración

Archivo: `tests/ej3-servicio-y-api.test.ts`

**3a · Repositorio falso (unitaria).** Completá los dos `it.todo` del bloque 3a usando el `crearRepositorioFalso()` que ya está en el archivo (sus métodos son funciones espía `vi.fn()`; `buscarPorId` devuelve un producto con stock 10):

- con datos válidos, `PedidoService.crear` llama a `repo.actualizar` **una sola vez** y con el producto con el **stock descontado**;
- con datos inválidos, lanza `ValidacionError` y **no** llama a `repo.actualizar`.

**3b · API con supertest (integración).** Hoy, `POST /pedidos` con un producto que no existe responde **500**, pero según R7 debe responder **404** con `{ error: mensaje }`.

1. Completá los dos `it.todo` del bloque 3b. El del producto inexistente **tiene que fallar** antes de que corrijas el código (TDD: rojo).
2. Corregí el código para que pase (verde). Pista: revisá qué capa traduce errores a códigos HTTP.

---

## 6. Entrega

1. `npm test` y `npm run typecheck` deben terminar sin errores. Los tests de los ejercicios que no hayas resuelto pueden quedar en `it.todo`.
2. `RESPUESTAS.md` completo.
3. Comprimí la carpeta del proyecto **sin `node_modules`** y entregala como indique el docente.

---

## 7. Ayuda memoria

```ts
import { describe, it, expect, vi } from 'vitest';

describe('grupo', () => {
  it('caso', () => {
    expect(valor).toBe(900);                 // igualdad estricta (números, strings)
    expect(objeto).toEqual({ a: 1 });        // igualdad de contenido (objetos, arrays)
    expect(objeto).toMatchObject({ a: 1 });  // el objeto contiene al menos esas propiedades
    expect(lista).toHaveLength(3);
    expect(() => fn(150)).toThrow(RangeError);   // la función lanza ese tipo de error
    expect(() => fn(10)).not.toThrow();
  });
});

// Funciones espía
const espia = vi.fn();
expect(espia).toHaveBeenCalled();
expect(espia).toHaveBeenCalledTimes(1);
expect(espia).toHaveBeenCalledWith({ nombre: 'x' });
expect(espia).not.toHaveBeenCalled();

// supertest
const res = await request(crearApp()).post('/ruta').send({ campo: 1 });
expect(res.status).toBe(201);
expect(res.body).toEqual({ error: '...' });
```

Recordá: un test con `async` necesita `await` en la llamada de supertest.
"# tlp4-recup2-tema-b-cafeteria" 
