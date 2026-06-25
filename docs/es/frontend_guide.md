# Guía de Estructura del Frontend (React + Tailwind)

La interfaz reactiva fue desarrollada usando **Vite** para un empaquetado rápido y **React** para componentes lógicos, ejecutándose de forma estable en NGINX a través de Docker.

## Layout y UX
Adoptamos un enfoque moderno de **Dashboard Unificado**.
- **Calendario y Lista Juntos:** El usuario ya no necesita transitar entre vistas. El calendario actúa como un Sidebar/Widget (en la columna derecha), y la lista de `Bloques` en el área principal (izquierda), aprovechando de manera limpia las columnas de Tailwind CSS.
- **Micro-interacciones:** Toda la interfaz tiene transiciones usando `transition-colors`, `hover:bg` y efectos rápidos (ej: opacidad en el botón "Nuevo Ítem" dentro del calendario).

## Modales para Entrada de Datos
Reemplazamos los formularios estáticos de la pantalla principal por **Modales**:
- Arquitectura de `Portal` en React o estado condicional, garantizando que las acciones de *Crear Bloque* o *Añadir Ítem* se superpongan en la pantalla con un fondo borroso (`backdrop-blur`).
- Se implementaron componentes enfocados: `BlockFormModal` e `ItemFormModal`.

## Documentación
- **Estándares JSDoc:** Todos los archivos `.js` y `.jsx` deben incluir **comentarios JSDoc** completos en inglés. Estos comentarios explican qué hace cada componente o archivo, sus parámetros y tipos de retorno.

## Componentización Lógica
Para mantener el diseño escalable, el proyecto usa:
- `/src/components`: Componentes reutilizables enfocados e independientes como `Modal`, `BlockFormModal`, `ItemFormModal`, `CalendarView`.
- `/src/pages`: Vistas principales agrupadoras (ej: `Login.jsx`, `Dashboard.jsx`).
- `/src/services`: Funciones de `axios` con interceptores centralizados (inyectando el token JWT Bearer y manejando las solicitudes a la API).

## Estilización (TailwindCSS)
- **Estilización:** Usamos TailwindCSS. El diseño debe ser moderno y premium, soportando el modo `dark`.
- **Responsividad:** Todos los componentes deben ser construidos "mobile-first" usando los prefijos responsivos de Tailwind (`sm:`, `md:`, `lg:`). Se deben usar grids flexibles y diseños apilables para garantizar que la aplicación funcione en todos los tamaños de pantalla.
- **Manejo de Estado:** Context API simple para Autenticación y Tema.
- **Dark Mode**: Cada componente de la plataforma soporta el prefijo `dark:`.
- Colores dinámicos inyectados directamente en la clase según la lógica (ej: `bg-emerald-100` vs `bg-rose-100`).

## Gestión del Estado
Para esta aplicación, las finanzas no requieren (inicialmente) bibliotecas de gestión robustas como Redux:
- Uso intensivo de `useState` y `useEffect` para cargar la lista base del Plan activo (Planes y sus Bloques correspondientes).
- Uso de **Context API (`AuthContext`)** para verificar la sesión del usuario y almacenar el Token JWT entre todas las pantallas.
- Las solicitudes hechas a través de la capa de servicio recargan la interfaz de usuario y cierran los modales de forma reactiva.
