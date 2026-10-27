Actúa como un Desarrollador Full-Stack Senior y Arquitecto de Software. Necesito estructurar, refactorizar y completar el desarrollo integral (Backend y Frontend en React) de un sistema web para la gestión y reserva de zonas comunes en una unidad residencial.

El repositorio debe mantener una separación limpia e intuitiva entre frontend y backend:
/
├── backend/
└── frontend/

Asegúrate de reorganizar los nombres de archivos y carpetas con convenciones estándar y arquitectura limpia para facilitar la navegación y el mantenimiento.

---

### 1. ARQUITECTURA Y BACKEND (MVC / API REST)

Completa y organiza los modelos, controladores, rutas y servicios bajo el patrón MVC o Arquitectura en Capas:

1. **Módulo de Usuarios (`User`):**
   - Campos: `id`, `nombre`, `apartamento`, `torre`, `correo` (único), `contraseña` (encriptada con bcrypt/hash), `rol` ('admin' | 'usuario'), `fechaCreacion`.
   - Controladores/Rutas:
     - `POST /api/auth/register`: Registro de usuarios.
     - `POST /api/auth/login`: Autenticación (con emisión de JWT o manejo de sesión).
     - `GET /api/users`: Listar usuarios (solo accesible para admin).

2. **Módulo de Espacios Comunes (`Space`):**
   - Campos: `id`, `nombre`, `categoria` (ej. Deportes, Eventos, Recreación), `aforo`, `descripcion`, `fotoUrl`, `horarioApertura`, `horarioCierre`, `ubicacion`, `activo` (booleano), `usoCompartido` (booleano: permite múltiples reservas simultáneas hasta alcanzar el aforo).
   - Controladores/Rutas:
     - `GET /api/spaces`: Listar todos los espacios activos.
     - `POST /api/spaces`: Crear nuevo espacio (restringido a 'admin').
     - `PUT/PATCH /api/spaces/:id`: Modificar estado/datos del espacio.

3. **Módulo de Reservas (`Booking`):**
   - Campos: `id`, `usuarioId` (relación), `espacioId` (relación), `fecha`, `duracion` (en horas o franja horaria), `numeroPersonas`, `notaOpcional`, `estado` ('confirmada' | 'cancelada'), `fechaCreacion`.
   - Controladores/Rutas:
     - `POST /api/bookings`: Crear reserva con validación de reglas de negocio (verificar que no choque con otras reservas si no es de uso compartido, no exceder el aforo, y estar dentro del horario de apertura/cierre del espacio).
     - `GET /api/bookings`: Listar todas las reservas (para admin).
     - `GET /api/bookings/my-bookings`: Listar reservas asociadas al usuario autenticado.
     - `PATCH /api/bookings/:id/cancel`: Cancelar reserva cambiando el estado a 'cancelada'.

---

### 2. FRONTEND (REACT)

Crea una interfaz moderna, profesional, intuitiva y responsive (utilizando CSS Modules, Tailwind CSS o Styled Components según la base del proyecto) con un tema visual adaptado a una unidad residencial moderna. Revisa y actualiza el enrutador en `App.jsx`.

#### A. Servicios de API (`/frontend/src/services/`)
Estructura clientes HTTP centralizados para consumir el backend:
- `authService.js`: login, registro, gestión de token/sesión y rol.
- `spaceService.js`: `getSpaces()`, `createSpace(data)`.
- `bookingService.js`: `getBookings()`, `getUserBookings()`, `createBooking(data)`, `cancelBooking(id)`.

#### B. Vistas y Componentes Requeridos
1. **Autenticación:**
   - **Registro:** Formulario con `nombre`, `apartamento`, `torre`, `correo`, `contraseña`, selector de `rol` ('admin' / 'usuario').
   - **Login:** Formulario con `correo` y `contraseña`. Manejo de redirección según el rol tras iniciar sesión.

2. **Espacios Comunes:**
   - **Formulario de Registro (Admin):** Campos: `nombre`, `categoría`, `aforo`, `descripción`, `fotoUrl`, `horario apertura`, `horario cierre`, `ubicación`, interruptor para `uso compartido`. Consumo del endpoint `POST`.
   - **Listado de Espacios (Catálogo):** Tarjetas visuales con la foto, aforo, horarios, badges de categoría y botón para "Reservar ahora".

3. **Reservas:**
   - **Formulario de Reserva (Residentes y Admin):** Selector interactivo de espacio, selector de `fecha`, `duración`, `número de personas` (con validación visual contra el aforo máximo del espacio) y campo de `nota opcional`. Consumo del endpoint `POST`.
   - **Panel "Mis Reservas" (Historial de Residentes):**
     - Lista/tarjetas de reservas del usuario actual.
     - Indicador visual del estado de la reserva (`confirmada` [verde] vs `cancelada` [rojo/gris]).
     - Botón de acción para "Cancelar reserva" que actualice dinámicamente la UI sin recargar toda la página.
   - **Panel de Gestión de Reservas (Vista Admin):** Visualización global de todas las reservas de la unidad con filtros por fecha y espacio.

4. **Navegación y Rutas (`App.jsx`):**
   - Implementa `react-router-dom` con rutas públicas (`/login`, `/registro`) y rutas protegidas (`/catalogo`, `/mis-reservas`, `/admin/nuevo-espacio`, `/admin/reservas-globales`).
   - Barra de navegación dinámica (Navbar) que muestre opciones distintas si el usuario es residente, administrador o si no está autenticado.

---

### 3. CRITERIOS DE CALIDAD Y ENTREGA
- **Persistencia e Integración:** Cero datos estáticos o mockeados en la entrega final. Todo formulario debe realizar la petición `POST` e inmediatamente reflejar la nueva entidad en su listado correspondiente.
- **Feedback de Usuario:** Estados de carga (loaders/spinners), alertas de éxito o error al enviar formularios, y diálogos de confirmación al cancelar una reserva.
- **Estructura de Directorios:** Muestra el árbol de carpetas propuesto tanto para `/backend` como para `/frontend` antes de desplegar el código.

IMPORTANTE: Guiate de este repositorio: https://github.com/Mariana-Marin/APP-Paseo-Entrega-Final