# StayBooking

StayBooking es una aplicación web para consultar hoteles, revisar habitaciones, comprobar disponibilidad, realizar reservas y gestionar pagos y facturas.

El sistema incluye una sección pública para clientes y un panel administrativo protegido mediante autenticación JWT y control de acceso por roles.

## Enlaces del proyecto

- Aplicación desplegada: https://staybooking.uaeftt-ute.site
- API REST: https://staybooking-api.uaeftt-ute.site/api/
- Repositorio frontend: https://github.com/ELMartin31611/staybooking_react
- Repositorio backend: https://github.com/ELMartin31611/reserva_hotel_backend

## Tecnologías utilizadas

- React 19
- TypeScript
- Vite
- React Router
- Axios
- TanStack React Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner
- Django REST Framework
- JWT
- GitHub Actions
- Nginx
- Gunicorn

## Funcionalidades principales

### Sección pública

- Página principal.
- Catálogo de hoteles.
- Búsqueda y filtros.
- Detalle de hotel.
- Tipos de habitación.
- Detalle de habitación.
- Galería de imágenes.
- Camas y servicios incluidos.
- Consulta de disponibilidad por fechas.
- Registro de usuarios.
- Inicio de sesión.

### Sección privada para clientes

- Perfil de usuario.
- Actualización de datos personales.
- Fotografía de perfil.
- Selección de habitaciones.
- Registro de adultos y niños.
- Validación de capacidad.
- Creación de reservas.
- Consulta de reservas.
- Detalle de reserva.
- Pago académico simulado.
- Visualización de facturas.

### Sección administrativa

El panel administrativo está protegido y solamente puede ser utilizado por usuarios con rol `ADMIN`.

Permite administrar:

- Hoteles.
- Direcciones de hoteles.
- Tipos de habitación.
- Habitaciones.
- Imágenes de habitaciones.
- Camas.
- Servicios.
- Temporadas.
- Tarifas.
- Reservas.
- Pagos.
- Facturas.

## Roles del sistema

| Rol | Permisos |
|---|---|
| `USUARIO` | Consultar hoteles, administrar su perfil, reservar habitaciones, pagar y consultar sus facturas |
| `ADMIN` | Acceso al panel administrativo y operaciones CRUD |
| Visitante | Consultar la parte pública y el catálogo de hoteles |

Las rutas administrativas están protegidas tanto en React como en la API REST.

## Arquitectura del proyecto

El frontend utiliza una adaptación de Arquitectura Limpia:

```text
src/
├── domain/
│   ├── entities/
│   ├── enums/
│   ├── exceptions/
│   ├── ports/
│   └── services/
│
├── application/
│   ├── dtos/
│   └── use-cases/
│
├── infrastructure/
│   ├── adapters/
│   ├── config/
│   ├── factories/
│   ├── http/
│   └── storage/
│
└── presentation/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── router/
    ├── store/
    ├── theme/
    └── utils/
```

### Responsabilidad de las capas

- `domain`: entidades, contratos y reglas de negocio puras.
- `application`: casos de uso y objetos de transferencia.
- `infrastructure`: conexión HTTP, Axios, almacenamiento y repositorios.
- `presentation`: pantallas, componentes, rutas, hooks y estado visual.

## Requisitos

Antes de ejecutar el proyecto se necesita:

- Node.js 20 o superior.
- npm 10 o superior.
- Git.
- Acceso a la API de StayBooking.

Comprobar las versiones:

```bash
node --version
npm --version
git --version
```

## Clonar el repositorio

```bash
git clone https://github.com/ELMartin31611/staybooking_react.git
cd staybooking_react
```

## Instalar dependencias

Para instalar exactamente las versiones registradas en `package-lock.json`:

```bash
npm ci
```

Si se están modificando dependencias:

```bash
npm install
```

No es necesario instalar cada paquete manualmente. Las dependencias se instalan localmente en cada computadora dentro de `node_modules`.

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://staybooking-api.uaeftt-ute.site/api/
```

También existe un archivo `.env.example` como referencia:

```env
VITE_API_BASE_URL=https://staybooking-api.uaeftt-ute.site/api/
```

Los archivos `.env`, `.env.local` y `.env.production` no deben subirse al repositorio.

## Conexión con la API

La URL base se obtiene mediante:

```typescript
import.meta.env.VITE_API_BASE_URL
```

La aplicación utiliza una instancia centralizada de Axios.

Las peticiones protegidas envían:

```http
Authorization: Bearer ACCESS_TOKEN
```

El sistema implementa:

- Almacenamiento del access token.
- Almacenamiento del refresh token.
- Interceptor de autenticación.
- Renovación automática de sesión.
- Limpieza de tokens al cerrar sesión.
- Manejo de errores `400`, `401`, `403`, `404` y `500`.

## Principales endpoints

```text
POST   /login/
POST   /register/
POST   /token/refresh/
GET    /perfil/

GET    /hoteles/
GET    /direcciones-hotel/
GET    /tipos-habitacion/
GET    /habitaciones/
GET    /habitaciones/disponibles/
GET    /imagenes-habitacion/
GET    /camas/
GET    /servicios/

GET    /temporadas/
GET    /tarifas-habitacion/

GET    /reservas/
POST   /reservas/crear-completa/
GET    /pagos/
POST   /pagos/procesar/
GET    /facturas/
```

Todos los endpoints se agregan a:

```text
https://staybooking-api.uaeftt-ute.site/api/
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173
```

## Verificar el código

Ejecutar el analizador:

```bash
npm run lint
```

Crear la compilación de producción:

```bash
npm run build
```

Si la compilación termina correctamente, se genera:

```text
dist/
```

Para probar esa compilación:

```bash
npm run preview
```

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta Vite en desarrollo |
| `npm run lint` | Analiza el código |
| `npm run build` | Comprueba TypeScript y genera producción |
| `npm run preview` | Ejecuta localmente la compilación |
| `npm ci` | Instala las versiones de `package-lock.json` |

## Credenciales de prueba

Por seguridad, el repositorio público no contiene credenciales administrativas reales.

Un cliente puede crear una cuenta desde:

```text
https://staybooking.uaeftt-ute.site/register
```

Para la evaluación se recomienda crear cuentas exclusivas de demostración:

```text
Cliente:
Usuario: demo_cliente
Contraseña: CONFIGURAR_ANTES_DE_LA_ENTREGA

Administrador:
Usuario: demo_admin
Contraseña: ENTREGAR_PRIVADAMENTE_AL_DOCENTE
```

Las credenciales administrativas deben compartirse directamente con el docente y no publicarse si permiten modificar datos reales.

## Flujo principal de reserva

1. El visitante consulta los hoteles.
2. Selecciona un hotel.
3. Escoge fechas de entrada y salida.
4. El backend devuelve las habitaciones disponibles.
5. El cliente selecciona una o más habitaciones.
6. Se validan adultos, niños y capacidad máxima.
7. El cliente registra los huéspedes.
8. La reserva se crea con estado `pendiente`.
9. Desde “Mis reservas” se realiza el pago académico.
10. La reserva pasa a `confirmada`.
11. El sistema genera la factura.

## Reglas de precio

El precio base se cobra por habitación y por noche, no por cada huésped.

Si la cantidad de huéspedes supera la capacidad incluida, cada huésped adicional genera un recargo del 50% del precio de la habitación.

```text
subtotal habitación = precio por noche × número de noches
recargo extra = precio por noche × 0.50 × huéspedes extra × noches
subtotal = habitaciones + recargos + servicios
impuestos = subtotal × 0.12
total = subtotal + impuestos
```

El backend realiza nuevamente todas las validaciones antes de crear la reserva.

## Autenticación y rutas protegidas

Las siguientes secciones requieren autenticación:

```text
/perfil
/mis-reservas
/reserva/seleccion
/reserva/huespedes
```

Las rutas bajo `/admin` requieren:

```text
rol = ADMIN
estado = ACTIVO
```

Si un usuario no tiene permisos, se redirige a la página de acceso denegado.

## Despliegue CI/CD

El frontend se despliega automáticamente mediante GitHub Actions.

Workflow:

```text
.github/workflows/deploy.yml
```

El proceso se ejecuta cuando existen cambios en `main`:

1. Descarga el código.
2. Instala Node.js 20.
3. Crea `.env.production`.
4. Ejecuta `npm ci`.
5. Ejecuta `npm run build`.
6. Copia `dist/` al VPS.
7. Publica los archivos con Nginx.
8. Valida la configuración de Nginx.
9. Recarga el servicio.

### Secretos utilizados en GitHub

```text
REACT_ENV
VPS_HOST
VPS_USER
VPS_KEY
```

Los valores de estos secretos no se incluyen en el código.

El secreto `REACT_ENV` contiene:

```env
VITE_API_BASE_URL=https://staybooking-api.uaeftt-ute.site/api/
```

### Directorio de despliegue

```text
/var/www/staybooking_react
```

### Servidor web

Nginx sirve la aplicación React y utiliza configuración SPA para redirigir rutas internas hacia `index.html`.

Ejemplo:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Evidencias funcionales

La entrega debe incluir:

- Pantalla pública principal.
- Pantalla de login.
- Dashboard administrativo.
- Listado consumiendo la API.
- Formulario creando o editando.
- Restricción por rol.
- Flujo de reserva.
- Pago académico.
- Factura generada.
- Video demostrativo de 3 a 5 minutos.

## Seguridad

- No se suben archivos `.env`.
- No se almacenan contraseñas en el frontend.
- Los permisos administrativos también se validan en Django.
- Las imágenes se cargan como archivos `multipart/form-data`.
- Las respuestas técnicas del servidor no se muestran directamente al usuario.
- Los tokens se eliminan al cerrar sesión.

## Equipo de desarrollo

Proyecto académico desarrollado para la materia de Desarrollo de Software.

- Integrante 1: autenticación, usuarios y perfil.
- Integrante 2: hoteles, habitaciones y servicios.
- Integrante 3 / líder: tarifas, reservas, pagos, facturas, administración e integración.

## Licencia

Proyecto académico. No se autoriza su uso comercial sin permiso del equipo.