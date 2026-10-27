# Portal del Paraíso · Unidad Residencial

Sistema web integral para la gestión y reserva de zonas comunes en una unidad residencial, desarrollado con arquitectura limpia, **Backend en Spring Boot (Java 17)** y **Frontend en React (Vite)**.

---

## 🌿 Características y Mejoras Implementadas

1. **Diseño Visual Neutro, Limpio y Relajante:**
   - Paleta cromática de colores sólidos basada en tonos bosque/salvia (`#2D4037`), lino cálido (`#F7F8F6`) y superficies blancas limpias con sutiles bordes neutros.
   - Eliminación de gradientes morados saturados y animaciones estridentes, logrando una atmósfera de bienestar, orden y tranquilidad residencial.
   - Tipografía equilibrada y componentes de alto confort visual.

2. **Home y Catálogo de Zonas Comunes con Imágenes:**
   - Presentación de portada arquitectónica con accesos directos y métricas de la unidad.
   - Mapeo y resolución automática de fotografías locales y remotas para todas las zonas comunes (Piscina, Gimnasio, Zona BBQ, Cancha múltiple, Coworking, Salón social, Parque infantil, Parque canino).
   - Catálogo interactivo con barra de búsqueda en tiempo real y filtros por categoría (*Deportes, Eventos, Recreación, Bienestar*).

3. **Módulo de Reservas 100% Funcional:**
   - Creación de reservas con validación inmediata de fecha mínima, franja horaria permitida y aforo máximo del espacio.
   - Soporte inteligente tanto para **uso exclusivo** (bloqueo total de horarios cruzados) como para **uso compartido** (control concurrente de personas hasta el límite de aforo).
   - Solución del error de preflight CORS (método `OPTIONS`) en el filtro de autenticación JWT.
   - Panel de **"Mis Reservas"** con indicador de estado (*Confirmada* / *Cancelada*) y cancelación dinámica sin recargar la página.
   - Panel de **"Gestión de Reservas Globales"** para administradores con filtros por fecha, espacio y estado, sumatorias métricas y cancelación con diálogo de confirmación.

4. **Semilla de Datos Automática (Seeder):**
   - Al iniciar la aplicación, si la base de datos está vacía, se cargan automáticamente los 8 espacios de la unidad y dos cuentas de prueba listas para evaluar.

---

## 🔑 Credenciales de Acceso Rápido

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@portal.com` | `admin123` | Gestión de reservas globales, registro de nuevos espacios y reservas |
| **Residente** | `residente@portal.com` | `residente123` | Explorar catálogo, realizar reservas y gestionar su historial en Mis Reservas |

*(También puedes registrar un nuevo usuario desde la pantalla de creación de cuenta).*

---

## 🚀 Instrucciones de Ejecución

### 1. Iniciar el Backend (Spring Boot)

Requisitos: Java 17 o superior.

```bash
cd backend
./mvnw spring-boot:run
```
*(En Windows Command Prompt o PowerShell: `.\mvnw.cmd spring-boot:run`)*

El backend se iniciará en `http://localhost:8080`.
- API Base: `http://localhost:8080/portalapi/v1` (y alias compatible `/api`)
- Consola H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./bd_portal`, usuario: `sa`, sin contraseña)

### 2. Iniciar el Frontend (React + Vite)

Requisitos: Node.js 18 o superior.

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## 📡 Endpoints del API REST

### Autenticación y Usuarios
- `POST /portalapi/v1/auth/register` (o `/api/auth/register`): Registro de residentes o administradores.
- `POST /portalapi/v1/auth/login` (o `/api/auth/login`): Inicio de sesión con generación de JWT.
- `GET /portalapi/v1/usuarios` (o `/api/users`): Listado de usuarios registrados *(Solo Admin)*.

### Zonas Comunes (Espacios)
- `GET /portalapi/v1/espacios` (o `/api/spaces`): Listado de espacios activos disponibles para reserva.
- `POST /portalapi/v1/espacios` (o `/api/spaces`): Crear nuevo espacio *(Solo Admin)*.
- `PUT /portalapi/v1/espacios/:id` (o `/api/spaces/:id`): Modificar información de un espacio *(Solo Admin)*.

### Reservas
- `POST /portalapi/v1/reservas` (o `/api/bookings`): Crear una nueva reserva validando reglas de negocio.
- `GET /portalapi/v1/reservas/my-bookings` (o `/api/bookings/my-bookings`): Reservas del usuario en sesión.
- `GET /portalapi/v1/reservas` (o `/api/bookings`): Listado global de reservas *(Solo Admin)*.
- `PATCH /portalapi/v1/reservas/:id/cancel` (o `/api/bookings/:id/cancel`): Cancelar una reserva.

---

## 📁 Estructura del Proyecto

```text
/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/PaseoAPP/
│       ├── configuraciones/      # Configuración de CORS e InicializadorDatos (Seed)
│       ├── controladores/        # Endpoints REST (Auth, Espacios, Reservas, Usuarios)
│       ├── dtos/                 # Objetos de transferencia de datos
│       ├── enums/                # CategoriaEspacio, EstadoReserva, Rol
│       ├── mapeadores/           # MapStruct para conversión Modelo <-> DTO
│       ├── modelos/              # Entidades JPA (Usuario, Espacio, Reserva)
│       ├── repositorios/         # Interfaces Spring Data JPA
│       ├── seguridad/            # UtilJWT, ContextoSesion, FiltroAutenticacion
│       ├── servicios/            # Lógica de negocio (reglas de reserva y horarios)
│       └── validadores/          # Validaciones de usuario y datos
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── assets/               # Fotografías de fachada, piscina, bbq, gym, etc.
        ├── componentes/          # Navbar, TarjetaEspacio, Spinner
        ├── contexto/             # ContextoSesion con persistencia y JWT
        ├── paginas/              # Home, ListaEspacios, RegistroReserva, MisReservas,
        │                         # ReservasGlobales, RegistroEspacio, Login, RegistroUsuario
        ├── rutas/                # RutaPrivada, RutaPorRol
        └── services/             # clienteApi (Axios), fotosEspacios, servicios por entidad
```
