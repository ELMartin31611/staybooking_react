# StayBooking Frontend

Frontend web de StayBooking para consultar hoteles, gestionar reservas y administrar la operación del sistema. Está construido con React, TypeScript y Vite, consume una API Django REST real y protege las rutas privadas mediante JWT y roles.

## Aplicación desplegada

- Frontend: <https://staybooking.uaeftt-ute.site>
- API REST: <https://staybooking-api.uaeftt-ute.site/api/>
- Repositorio: <https://github.com/ELMartin31611/staybooking_react>

## Funcionalidades

### Área pública y de clientes

- Home y catálogo público de hoteles.
- Búsqueda y filtros con paginación.
- Detalle de hotel, tipos de habitación, habitaciones, imágenes, camas y servicios.
- Registro, inicio de sesión, renovación de token y cierre de sesión.
- Perfil, foto, datos de cliente, direcciones y documentos.
- Consulta de disponibilidad por fechas.
- Selección de habitaciones y huéspedes con validación de capacidad.
- Cálculo de noches, impuestos y cargos por huéspedes extra.
- Creación y consulta de reservas.
- Pago académico, confirmación de reserva y factura.
- Tema claro/oscuro y diseño adaptable a móvil.

### Área administrativa

El acceso a `/admin` requiere autenticación y rol `ADMIN`.

- Dashboard con indicadores y reservas recientes.
- CRUD de hoteles y direcciones.
- CRUD de tipos de habitación y habitaciones.
- Carga de imágenes de habitaciones mediante archivos multipart.
- CRUD de servicios.
- Gestión de temporadas y tarifas.
- Consulta de reservas.
- Consulta de pagos y facturas.

## Tecnologías

- React 19 + TypeScript
- Vite
- React Router
- Axios
- TanStack React Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS 4
- shadcn/ui, Base UI y Lucide
- Sonner
- next-themes

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Acceso a una API StayBooking compatible.

## Instalación

```bash
git clone https://github.com/ELMartin31611/staybooking_react.git
cd staybooking_react
npm ci
```

No es necesario instalar cada dependencia manualmente. `npm ci` usa `package-lock.json` y deja exactamente las versiones aprobadas por el proyecto.

## Variables de entorno

Crea un archivo `.env` en la raíz. No lo subas al repositorio.

```env
VITE_API_BASE_URL=https://staybooking-api.uaeftt-ute.site/api/
```

También se incluye `.env.example` como referencia.

## Comandos

```bash
# Servidor local
npm run dev

# Revisión estática
npm run lint

# Compilación de producción
npm run build

# Previsualizar el build
npm run preview
```

La aplicación local se abre normalmente en <http://localhost:5173>.

## Credenciales de prueba

Por seguridad, el repositorio no contiene contraseñas. Usa las credenciales entregadas por el equipo o crea un usuario desde `/register`. El acceso al panel administrativo requiere que el usuario tenga el rol `ADMIN` en la API.

## Conexión y autenticación

La URL base se obtiene de `VITE_API_BASE_URL`. El cliente HTTP:

1. adjunta el `access_token` como `Authorization: Bearer ...`;
2. intenta renovar la sesión con el `refresh_token` cuando corresponde;
3. reintenta una sola vez la solicitud original;
4. limpia la sesión y redirige al login si la renovación no es válida;
5. traduce los errores HTTP a mensajes comprensibles;
6. conserva `Content-Type` automático para que las cargas multipart funcionen.

Los tokens se guardan en `localStorage`, tal como requiere el alcance académico del proyecto. Para un sistema financiero o de alta seguridad se recomienda migrar el refresh token a una cookie `HttpOnly`, `Secure` y `SameSite`.

## Arquitectura

```text
src/
├── domain/           # entidades, puertos y reglas puras
├── application/      # casos de uso y DTO
├── infrastructure/   # Axios, adaptadores, storage, config y factories
└── presentation/     # páginas, componentes, hooks, store, tema y router
```

Las dependencias apuntan hacia el dominio: la presentación invoca casos de uso y los adaptadores de infraestructura implementan los puertos.

## Flujo Git recomendado

```bash
git checkout main
git pull origin main
git checkout -b NOMBRE-RAMA

# Después de desarrollar y comprobar
npm run lint
npm run test
npm run build
git add src
git commit -m "feat: descripción del cambio"
git push -u origin NOMBRE-RAMA
```

No uses `git add .` sin revisar primero `git status`. Nunca subas `.env`, `node_modules`, `dist`, capturas o archivos temporales.

## CI/CD

El workflow `.github/workflows/deploy.yml` se ejecuta al hacer push a `main` o manualmente mediante `workflow_dispatch`.

El proceso:

1. descarga el repositorio;
2. configura Node.js 20;
3. crea `.env.production` desde un secreto;
4. instala con `npm ci`;
5. ejecuta `npm run build`;
6. copia `dist/` al VPS por SSH;
7. valida Nginx y recarga el servicio.

### Secrets de GitHub Actions

| Secreto | Uso |
| --- | --- |
| `REACT_ENV` | Contenido completo de `.env.production` |
| `VPS_HOST` | Host o IP del servidor |
| `VPS_USER` | Usuario SSH de despliegue |
| `VPS_KEY` | Clave privada SSH |

Ejemplo de `REACT_ENV`:

```env
VITE_API_BASE_URL=https://staybooking-api.uaeftt-ute.site/api/
```

El servidor debe servir la carpeta de producción de React y redirigir las rutas desconocidas a `index.html` para que React Router pueda resolverlas.

## Verificación antes de entregar

```bash
npm ci
npm run lint
npm run build
```

Después comprueba manualmente: Home, catálogo, detalle, registro, login, retorno después del login, perfil, disponibilidad, reserva, pago, factura, acceso denegado sin rol y todos los módulos del panel administrativo.

## Media y disponibilidad

El frontend consume el detalle enriquecido de `GET /hoteles/:id/detalle/`, el
calendario de una habitación desde `GET /habitaciones/:id/calendario/?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`
y la colección multipart `media-hotel/`.

1. En **Administración > Hoteles**, usa el icono de galería para cargar imágenes
   (`png`, `jpeg`, `webp`) o videos (`mp4`, `webm`), definir el orden y marcar el
   archivo principal. El panel permite editar metadatos y eliminar archivos.
2. La home usa el media principal que devuelve `/media-hotel/`; si todavía no hay
   archivos o la API no está disponible, muestra un carrusel visual de respaldo.
3. En el detalle de una habitación, el calendario bloquea días pasados,
   reservados y no reservables. Solo un rango válido continúa al selector de
   habitaciones, donde el backend vuelve a validar la disponibilidad.

Para el backend, aplica la migración manual `0008_media_hotel.py` antes de
publicar esta versión y verifica que `media-hotel/` acepte los campos
`hotel`, `archivo`, `tipo`, `titulo`, `descripcion`, `orden` y `es_principal`.

### Validación de entrega

```bash
npm run lint
npm run build
```

Además de la compilación, prueba una carga y edición de media con un usuario
administrador, revisa el carrusel público y selecciona un rango que incluya una
fecha ocupada para confirmar que el calendario no permite continuar.

## Precio y flujo de reserva

La tarifa es por habitación y noche, nunca por adulto o niño. La capacidad incluida no modifica la tarifa base; solo cada huésped que supere `capacidad_total` añade el 50% de la tarifa nocturna. Django es la fuente definitiva de tarifas, impuestos, compatibilidad de servicios y total.

El cliente envía una reserva completa a `reservas/crear-completa/` con fechas, habitaciones, huéspedes y servicios opcionales como `[{ "servicio_id": 1, "cantidad": 2 }]`. No envía precios ni totales. Los servicios incluidos se muestran sin cargo y los adicionales se validan contra el tipo de habitación en Django.
