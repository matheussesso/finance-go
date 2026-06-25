# System Architecture and Infrastructure

The FinanceGo application was designed strictly separating the Frontend (React) from the Backend (Go REST API). This guarantees high scalability, independent testing, and a clean maintenance workflow. Everything is transparently orchestrated using **Docker**.

## 🚀 Infrastructure (Docker All-in-One)
The entire project is designed to run in production and development using containers:

1. **MariaDB (`mariadb`)**: Relational database. Safely persists data through Docker volumes.
2. **Backend API (`api-go-backend`)**: Runs our ultra-light, natively compiled Go image on port 8080.
3. **Frontend SPA (`api-go-frontend`)**: Interface encapsulated in **NGINX**, ensuring maximum performance for static loading.

## ⚙️ Backend (Go API)
We use an architecture inspired by **Clean Architecture** and Domain-Driven Design (DDD) concepts, adapted for Go. This ensures that the business logic doesn't depend on specific web frameworks or databases.

**Package Structure:**
- `cmd/api`: The entry point of the application. Initializes settings, connects to the database, and boots the HTTP server.
- `internal/domain`: Core business entities (`User`, `Planning`, `Block`, `Item`) and interface contracts (`Repositories`). No external dependencies enter here.
- `internal/repository`: The concrete implementation of data persistence. This is where the ORM (GORM) acts, mapping code to SQL.
- `internal/service`: Contains all business rules, financial calculations, and authorization logic.
- `internal/handler`: The web layer (HTTP Controllers). Receives requests (JSON), translates them for the `Service` to process, and responds using a fixed JSON pattern.

**Backend Multi-stage Build:** Its `Dockerfile` uses the Golang image only to "compile" the code. Then it copies the final binary (Linux `.exe`) to a tiny `alpine` image. The source code **never** goes to production, only the already compiled machine!

## 🎨 Frontend (React + Vite)
- Reactive SPA (Single Page Application) interface.
- Direct communication via asynchronous HTTP calls (Axios/Fetch) to the Go API.
- Premium and utility styling focused on **Tailwind CSS**.
- Localized state management (via Context API/Hooks) for manipulating financial blocks and calendar in real-time.

**Frontend Multi-stage Build:** The `Dockerfile` uses Node.js only in the first stage to run the `npm run build` command and bundle React. The generated HTML, CSS, and JS code (`/dist`) is then passed to the final **NGINX** image. Thus, we don't run Node in production for React, just a super-fast static web server listening on port 80 and routed to host's `5173`.
