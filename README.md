# E-Commerce Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-20232a?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

Frontend de una tienda online construido con Next.js. La aplicacion consume una API externa para autenticacion, catalogo de productos, carrito, ordenes y checkout.

## Enlaces

- Repositorio frontend: `https://github.com/programadorweb898-code/frontend_e-commerce`
- API backend: `https://backend-e-commerce-wekg.onrender.com`
- Deploy frontend: configurado en Vercel mediante GitHub Actions

## Caracteristicas

- Catalogo de productos con busqueda y filtros por precio
- Registro e inicio de sesion
- Carrito de compras con persistencia por usuario
- Visualizacion de ordenes
- Internacionalizacion basica en espanol e ingles
- Tests unitarios/integración con Vitest
- Tests end-to-end con Playwright
- CI/CD con GitHub Actions y despliegue en Vercel

## Stack

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Vitest
- Playwright
- Tailwind CSS

## Requisitos

- Node.js 20 o superior
- npm

## Variables de entorno

Crea un archivo `.env.local` en la raiz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://backend-e-commerce-wekg.onrender.com
```

Si estas trabajando con un backend local, podes cambiarlo por:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Instalacion

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:e2e
```

## Testing

### Tests unitarios e integracion

```bash
npm test
```

### Tests end-to-end

```bash
npm run test:e2e
```

Los tests E2E usan Playwright y necesitan que el frontend pueda conectarse a una API valida mediante `NEXT_PUBLIC_API_URL`.

## CI/CD

El workflow principal esta en `.github/workflows/ci-cd.yml` y ejecuta:

1. Tests unitarios e integración con Vitest
2. Tests E2E con Playwright
3. Deploy a produccion en Vercel si el push a `main` pasa todos los tests
4. Deploy preview en pull requests

## Estructura principal

```text
app/                Rutas y paginas de Next.js
components/         Componentes reutilizables
context/            Contextos globales
lib/                Cliente API, utilidades y configuracion
tests/e2e/          Tests end-to-end con Playwright
.github/workflows/  Pipelines de GitHub Actions
```

## Deploy

El proyecto esta preparado para desplegarse en Vercel mediante GitHub Actions. Para que el deploy funcione correctamente, el repositorio necesita estos secretos:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

El backend utilizado por defecto en CI y en entornos compartidos es:

```text
https://backend-e-commerce-wekg.onrender.com
```

## Notas

- El frontend depende de un backend externo para autenticacion y operaciones del carrito.
- Si los tests E2E fallan en CI, revisa primero que `NEXT_PUBLIC_API_URL` apunte a una API accesible desde GitHub Actions.
