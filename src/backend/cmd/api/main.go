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

// func main() é o ponto central (entrypoint) de toda aplicação Go.
// Diferente do PHP, onde o servidor web (Apache/Nginx) roda um script index.php
// a cada requisição, em Go a aplicação SOBE o próprio servidor e fica em memória 
// rodando de forma contínua, atendendo múltiplas requisições assincronamente (Goroutines).
func main() {
	// Tenta carregar o arquivo .env (útil para rodar localmente sem Docker)
	// Em ambiente Docker, as variáveis já são injetadas nativamente.
	_ = godotenv.Load("../.env")

	// DSN - Lê das Variáveis de Ambiente (Docker ou .env) ou usa Fallback para dev local
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "apiuser:apipassword@tcp(localhost:3306)/personal_finance?charset=utf8mb4&parseTime=True&loc=Local"
	}
	
	// Aguardamos 2 segundos por precaução, mas o Docker Healthcheck já garante que o DB tá de pé
	time.Sleep(2 * time.Second)

	// Conectamos ao banco e	// Atualiza as tabelas no MariaDB
	db, err := repository.ConnectDB(dsn)
	err = db.AutoMigrate(&domain.User{}, &domain.Planning{}, &domain.Block{}, &domain.Item{})
	if err != nil {
		// log.Fatalf encerra a aplicação inteira (equivalente a um "die()")
		log.Fatalf("Erro crítico ao inicializar o banco: %v", err)
	}

	// Popula o banco com dados iniciais se estiver vazio (Seeders)
	repository.SeedDatabase(db)

	// ---------------------------------------------------------
	// SETUP DAS DEPENDÊNCIAS (Injeção de Dependência)
	// No Laravel, o "Service Container" faz a injeção automaticamente via Reflection
	// (ex: public function __construct(UserRepository $repo)).
	// Em Go, nós instanciamos e passamos as dependências explicitamente (Manual DI),
	// o que deixa o fluxo extremamente claro, rápido e limpo.
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

	// Inicializamos o "Roteador" (equivalente ao routes/api.php do Laravel)
	r := chi.NewRouter()

	// ---------------------------------------------------------
	// MIDDLEWARES
	// Interceptam as requisições antes de chegarem aos Handlers
	// ---------------------------------------------------------
	r.Use(middleware.Logger)    // Loga cada requisição HTTP no terminal
	r.Use(middleware.Recoverer) // Evita que o servidor crashe se der Panic (fatal error)

	// O CORS permite que nosso Frontend no React/Vite (porta 5173 ou 3000) 
	// faça chamadas para a porta 8080 do Go sem ser bloqueado pelo navegador.
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// ---------------------------------------------------------
	// DEFINIÇÃO DE ROTAS (Endpoints)
	// ---------------------------------------------------------
	
	// Rota básica para checar se a API está online (GET /api/health)
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "API Go Online e Operacional"})
	})

	// Agrupamento de rotas com o prefixo /api/auth (Públicas)
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	// Rotas Protegidas (Exigem JWT)
	// Equivalente ao Route::middleware('auth:api')->group(...) no Laravel
	r.Group(func(r chi.Router) {
		r.Use(mymiddleware.AuthMiddleware)

		// Planejamentos (Plannings)
		r.Get("/api/plannings", planningHandler.GetAll)
		r.Post("/api/plannings", planningHandler.Create)
		r.Get("/api/plannings/{id}", planningHandler.GetByID)
		r.Delete("/api/plannings/{id}", planningHandler.Delete)

		// Blocos (Blocks)
		r.Get("/api/blocks", blockHandler.List)
		r.Post("/api/blocks", blockHandler.Create)
		r.Delete("/api/blocks/{id}", blockHandler.Delete)

		// Itens (Items)
		r.Post("/api/items", itemHandler.Create)
		r.Delete("/api/blocks/{blockId}/items/{itemId}", itemHandler.Delete)
	})

	log.Println("🚀 Servidor Go rodando na porta :8080")
	
	// Sobe de fato o servidor HTTP ouvindo na porta 8080.
	// Se houver algum erro fatal (porta já em uso), ele dá crash.
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}
