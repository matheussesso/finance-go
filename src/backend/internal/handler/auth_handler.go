package handler

import (
	"backend/internal/service"
	"backend/pkg/i18n"
	"backend/pkg/response"
	"encoding/json"
	"net/http"
)

// AuthHandler gerencia as requisições HTTP para registro e login.
// Equivale a um "AuthController" em frameworks PHP (como Laravel).
// Nota: Aqui não temos "regras de negócio", ele apenas traduz a internet (HTTP/JSON)
// para o Go (chamando o UserService).
type AuthHandler struct {
	userService *service.UserService
}

// NewAuthHandler é o construtor que injeta o UserService no Handler.
func NewAuthHandler(userService *service.UserService) *AuthHandler {
	return &AuthHandler{userService: userService}
}

// RegisterRequest é um DTO (Data Transfer Object).
// Representa o payload (Body) esperado na requisição JSON.
// Equivale ao "FormRequest" do Laravel, onde definimos as regras dos campos.
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Register é o endpoint chamado no POST /api/auth/register.
// Funções de Handler no Go sempre recebem (http.ResponseWriter, *http.Request).
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	
	// json.NewDecoder() lê o body da requisição e transforma o JSON em nossa struct Go (req).
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return // "return" no Go encerra a execução do método imediatamente
	}

	// Validação super básica (futuramente podemos usar pacotes de validação, igual Validator do PHP)
	if req.Name == "" || req.Email == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "all_fields_required"))
		return
	}

	// Repassa o processamento pesado e regras de banco de dados para o SERVICE.
	user, err := h.userService.Register(req.Name, req.Email, req.Password)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), err.Error()))
		return
	}

	// Devolvemos status HTTP 201 (Created) e o objeto em JSON.
	response.JSON(w, http.StatusCreated, user)
}

// LoginRequest mapeia as credenciais vindas do frontend.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login é o endpoint POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return
	}

	// Aciona o serviço para realizar login, comparar hash, gerar token, etc.
	token, user, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), err.Error()))
		return
	}

	// Preparamos o retorno. No PHP, faríamos um array associativo ['token' => $token, 'user' => $user].
	// No Go usamos map[string]interface{}.
	data := map[string]interface{}{
		"token": token,
		"user":  user,
	}

	response.JSON(w, http.StatusOK, data)
}
