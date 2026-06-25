package main

import (
	"backend/internal/domain"
	"backend/internal/handler"
	mymiddleware "backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/service"
	"backend/pkg/response"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

// func main() is the central entrypoint of the entire Go application.
// Unlike PHP, where the web server (Apache/Nginx) runs an index.php script
// on each request, in Go the application BOOTS its own server and stays in memory 
// running continuously, handling multiple requests asynchronously (Goroutines).
func main() {
	// Try to load the .env file (useful for running locally without Docker)
	// In a Docker environment, variables are already injected natively.
	_ = godotenv.Load("../.env")

	// DSN - Read from Environment Variables (Docker or .env) or use Fallback for local dev
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "apiuser:apipassword@tcp(localhost:3306)/personal_finance?charset=utf8mb4&parseTime=True&loc=Local"
	}
	
	// Wait 2 seconds just in case, but the Docker Healthcheck already ensures the DB is up
	time.Sleep(2 * time.Second)

	// Connect to the database and update tables in MariaDB
	db, err := repository.ConnectDB(dsn)
	err = db.AutoMigrate(&domain.User{}, &domain.Planning{}, &domain.Block{}, &domain.Item{})
	if err != nil {
		// log.Fatalf shuts down the entire application (equivalent to a "die()")
		log.Fatalf("Critical error initializing the database: %v", err)
	}

	// Populate the database with initial data if it is empty (Seeders)
	repository.SeedDatabase(db)

	// ---------------------------------------------------------
	// DEPENDENCIES SETUP (Dependency Injection)
	// In Laravel, the "Service Container" does the injection automatically via Reflection
	// (e.g.: public function __construct(UserRepository $repo)).
	// In Go, we instantiate and pass the dependencies explicitly (Manual DI),
	// which makes the flow extremely clear, fast and clean.
	// ---------------------------------------------------------
	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	authHandler := handler.NewAuthHandler(userService)

	blockRepo := repository.NewBlockRepository(db)
	blockService := service.NewBlockService(blockRepo)
	blockHandler := handler.NewBlockHandler(blockService)

	itemRepo := repository.NewItemRepository(db)
	itemService := service.NewItemService(itemRepo, blockRepo)
	itemHandler := handler.NewItemHandler(itemService)

	planningRepo := repository.NewPlanningRepository(db)
	planningService := service.NewPlanningService(planningRepo)
	planningHandler := handler.NewPlanningHandler(planningService)

	// Initialize the "Router" (equivalent to routes/api.php in Laravel)
	r := chi.NewRouter()

	// ---------------------------------------------------------
	// MIDDLEWARES
	// Intercept requests before they reach the Handlers
	// ---------------------------------------------------------
	r.Use(middleware.Logger)    // Logs each HTTP request in the terminal
	r.Use(middleware.Recoverer) // Prevents the server from crashing on Panic (fatal error)
	r.Use(mymiddleware.LanguageMiddleware) // Extracts the client language into Context

	// CORS allows our Frontend in React/Vite (port 5173 or 3000) 
	// to make calls to Go's port 8080 without being blocked by the browser.
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// ---------------------------------------------------------
	// ROUTES DEFINITION (Endpoints)
	// ---------------------------------------------------------
	
	// Basic route to check if the API is online (GET /api/health)
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "API Go Online e Operacional"})
	})

	// Route grouping with the /api/auth prefix (Public)
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	// Protected Routes (Require JWT)
	// Equivalent to Route::middleware('auth:api')->group(...) in Laravel
	r.Group(func(r chi.Router) {
		r.Use(mymiddleware.AuthMiddleware)

		// Plannings
		r.Get("/api/plannings", planningHandler.GetAll)
		r.Post("/api/plannings", planningHandler.Create)
		r.Get("/api/plannings/{id}", planningHandler.GetByID)
		r.Delete("/api/plannings/{id}", planningHandler.Delete)

		// Blocks
		r.Get("/api/blocks", blockHandler.List)
		r.Post("/api/blocks", blockHandler.Create)
		r.Delete("/api/blocks/{id}", blockHandler.Delete)

		// Items
		r.Post("/api/items", itemHandler.Create)
		r.Delete("/api/blocks/{blockId}/items/{itemId}", itemHandler.Delete)
	})

	log.Println("🚀 Go server running on port :8080")
	
	// Actually starts the HTTP server listening on port 8080.
	// If there is any fatal error (port already in use), it crashes.
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Error starting the server: %v", err)
	}
}
