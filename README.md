# E-Commerce Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-20232a?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry&logoColor=white)
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
- Monitoreo de errores y trazas con Sentry
- CI/CD con GitHub Actions y despliegue en Vercel

## Stack

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Sentry
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
SENTRY_DSN=https://tu-dsn-de-sentry.ingest.us.sentry.io/proyecto
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn-de-sentry.ingest.us.sentry.io/proyecto
```

Si estas trabajando con un backend local, podes cambiarlo por:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Variables opcionales para Sentry:

- `SENTRY_DSN`: el DSN de tu proyecto en Sentry, para server y edge (no lo compartas en el repositorio).
- `NEXT_PUBLIC_SENTRY_DSN`: el mismo DSN, para el client (necesita el prefijo `NEXT_PUBLIC_` para que Next.js lo exponga al navegador).
- `SENTRY_AUTH_TOKEN`: token de autenticacion de Sentry, necesario para subir source maps durante el build. Solo se usa en CI (ver seccion Deploy).

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
sentry.*.config.ts  Configuracion de Sentry (server, edge y client)
instrumentation*.ts Inicializacion de Sentry
app/global-error.tsx  Pagina de error global que reporta a Sentry
.github/workflows/  Pipelines de GitHub Actions
```

## Deploy

El proyecto esta preparado para desplegarse en Vercel mediante GitHub Actions. Para que el deploy funcione correctamente, el repositorio necesita estos secretos:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SENTRY_AUTH_TOKEN` (para subir source maps a Sentry durante el build)

El backend utilizado por defecto en CI y en entornos compartidos es:

```text
https://backend-e-commerce-wekg.onrender.com
```

## Notas

- El frontend depende de un backend externo para autenticacion y operaciones del carrito.
- Si los tests E2E fallan en CI, revisa primero que `NEXT_PUBLIC_API_URL` apunte a una API accesible desde GitHub Actions.
- Sentry reporta errores en server, edge y client. El `org` y `project` del plugin de build estan definidos en `next.config.ts`.
- Si el build falla con errores del plugin de Sentry, verifica que `SENTRY_AUTH_TOKEN` este configurado en los secretos del repositorio.
