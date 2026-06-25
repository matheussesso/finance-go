# Arquitectura del Sistema e Infraestructura

La aplicación FinanceGo fue diseñada separando rigurosamente el Frontend (React) del Backend (API REST en Go). Esto garantiza una alta escalabilidad, pruebas independientes y un flujo de mantenimiento limpio. Todo está orquestado de manera transparente utilizando **Docker**.

## Infraestructura (Docker All-in-One)
Todo el proyecto está diseñado para ejecutarse en producción y desarrollo usando contenedores:

1. **MariaDB (`mariadb`)**: Base de datos relacional. Persiste los datos de manera segura a través de volúmenes de Docker.
2. **Backend API (`api-go-backend`)**: Ejecuta nuestra imagen ultraligera compilada nativamente en Go en el puerto 8080.
3. **Frontend SPA (`api-go-frontend`)**: Interfaz encapsulada en **NGINX**, garantizando un rendimiento máximo para la carga estática.

## Backend (Go API)
Utilizamos una arquitectura inspirada en **Clean Architecture** y conceptos de Domain-Driven Design (DDD), adaptada para Go. Esto asegura que la lógica de negocios no dependa de frameworks web o bases de datos específicos.

**Estructura de paquetes:**
- `cmd/api`: Punto de entrada de la aplicación. Inicializa configuraciones, se conecta a la base de datos y levanta el servidor HTTP.
- `internal/domain`: Entidades "core" del negocio (`User`, `Planning`, `Block`, `Item`) y contratos de interfaces (`Repositories`). Ninguna dependencia externa entra aquí.
- `internal/repository`: La implementación concreta de la persistencia de datos. Aquí es donde el ORM (GORM) actúa mapeando el código a SQL.
- `internal/service`: Contiene toda la regla de negocio, cálculos financieros y tratamientos de autorización.
- `internal/handler`: La capa web (Controladores HTTP). Recibe la petición (JSON), la traduce para que el `Service` la procese y responde usando un patrón JSON fijo.

**Build Multi-stage del Backend:** Su `Dockerfile` usa la imagen de Golang solo para "compilar" el código. Luego copia el binario final (el `.exe` de Linux) a una imagen `alpine` minúscula. El código fuente **nunca** va a producción, ¡solo la máquina ya compilada!

## Frontend (React + Vite)
- Interfaz reactiva SPA (Single Page Application).
- Comunicación directa vía llamadas HTTP asíncronas (Axios/Fetch) a la API en Go.
- Estilización premium y utilitaria enfocada en **Tailwind CSS**.
- Gestión de estado localizada (vía Context API/Hooks) para la manipulación de los bloques financieros y el calendario en tiempo real.

**Build Multi-stage del Frontend:** El `Dockerfile` usa Node.js solo en la primera etapa para ejecutar el comando `npm run build` y empaquetar React. El código HTML, CSS y JS generado (`/dist`) se pasa luego a la imagen final de **NGINX**. Con esto, no corremos Node en producción para React, solo un servidor web estático súper rápido escuchando en el puerto 80 y enrutado al puerto `5173` del Host.
