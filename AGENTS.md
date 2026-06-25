# FinanceGo - Project Rules & Architecture

This file defines the strict workspace rules, architecture standards, and best practices for this specific repository.

## 1. Project Context
- **Name:** FinanceGo
- **Stack:** Go (Backend API) + React/Vite (Frontend SPA) + MariaDB (Database) + Docker Compose (Infra).
- **Goal:** Personal Finance Management System. Transition project for a PHP/Laravel developer learning Go.

## 2. Architecture & Design Patterns (Backend - Go)
- **Directory:** `/src/backend`
- **Clean Architecture Focus:**
  - `cmd/api`: Entrypoint, server boot, DI wiring, environment loading.
  - `internal/handler`: HTTP layer (routing via `go-chi/chi`). Only parses requests and returns JSON. Thin controllers. No business logic.
  - `internal/service`: Core business logic, cross-validations. Returns custom errors.
  - `internal/repository`: Data access layer (GORM). Interacts directly with DB.
  - `internal/domain`: Structs and interfaces for entities (e.g., `User`, `Planning`, `Block`, `Item`).
  - `internal/middleware`: HTTP interceptors (JWT, CORS, LanguageMiddleware).
- **Dependency Injection:** Manual DI constructor functions (e.g., `NewUserService()`). No reflection-based frameworks.
- **Database:** MariaDB via GORM. Use `db.AutoMigrate()` in `main.go`.
- **Authentication:** JWT tokens via HTTP Bearer headers. Protected routes grouped under AuthMiddleware.
- **Error Handling & i18n:** Standard Go `if err != nil`. No panics for business logic. Services return i18n error keys (e.g. `errors.New("invalid_credentials")`). Handlers wrap errors and translate them using `i18n.T(r.Context(), err.Error())` before returning standardized JSON via `pkg/response`. Language is injected in context via `LanguageMiddleware` from the `Accept-Language` header.

## 3. Architecture & Design Patterns (Frontend - React)
- **Directory:** `/src/frontend`
- **Stack:** Vite + React + TailwindCSS v3.
- **State Management:** React Context API (`AuthContext`, `ThemeContext`).
- **Styling:** Tailwind exclusively. Keep it clean, modern, and premium. Support `dark` mode via class strategy. Use subtle gradients, micro-animations, and glassmorphism.
- **Responsiveness:** All components must be built mobile-first using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`). Avoid fixed sizes that break on small screens. Use flexible grids and stacking layouts (`flex-col sm:flex-row`).
- **Layout & Forms:** Unified Dashboard. Modals (`Modal.jsx`) used for data entry instead of static inline forms.
- **Routing:** `react-router-dom` with explicit `PrivateRoute` wrappers.
- **API Consumption:** `axios` configured centrally at `src/services/api.js` with Request Interceptors injecting JWT token and `Accept-Language` header from `localStorage`.
- **i18n:** Multi-language support via `react-i18next`. All components must use the `useTranslation` hook instead of hardcoded text strings.

## 4. Coding Standards
- Keep responses short. Talk less, code more.
- Always check `.env` existence logic (`godotenv.Load`) but default to `os.Getenv()`.
- Add Go-doc comments mimicking PHP equivalents for educational purposes (e.g., `// Handler = Controller`, `// Pointer = Reference`).
- **Frontend Documentation:** Add comprehensive JSDoc comments to all frontend files (`.jsx` and `.js`) in English, detailing the components, parameters, and return types.
- Prioritize: quality, security, performance, readability, scalability.
- DRY and KISS principles apply strictly.

## 5. Docker Infrastructure
- **MariaDB:** Official image, healthcheck configured.
- **Go API (`api-go-backend`):** Multi-stage build (`golang:alpine` builder -> `alpine` scratch image).
- **React Frontend (`api-go-frontend`):** Multi-stage build (`node:20-alpine` builder -> `nginx:alpine` to serve static files). Maps port `80` to `5173`.
- **Network:** They share the Docker compose network. Go connects using hostname `mariadb`. Frontend connects from the browser via localhost exposing.

Never break these architectural boundaries. If modifying features, update `domain` -> `repository` -> `service` -> `handler` sequentially.
