package handler

import (
	"backend/internal/service"
	"backend/pkg/i18n"
	"backend/pkg/response"
	"encoding/json"
	"net/http"
)

// AuthHandler manages HTTP requests for registration and login.
// Equivalent to an "AuthController" in PHP frameworks (like Laravel).
// Note: We don't have "business rules" here, it just translates the internet (HTTP/JSON)
// to Go (calling the UserService).
type AuthHandler struct {
	userService *service.UserService
}

// NewAuthHandler is the constructor that injects UserService into the Handler.
func NewAuthHandler(userService *service.UserService) *AuthHandler {
	return &AuthHandler{userService: userService}
}

// RegisterRequest is a DTO (Data Transfer Object).
// Represents the payload (Body) expected in the JSON request.
// Equivalent to Laravel's "FormRequest", where we define field rules.
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Register is the endpoint called on POST /api/auth/register.
// Handler functions in Go always receive (http.ResponseWriter, *http.Request).
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	
	// json.NewDecoder() reads the request body and transforms the JSON into our Go struct (req).
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return // "return" in Go stops the method execution immediately
	}

	// Super basic validation (in the future we can use validation packages, like PHP's Validator)
	if req.Name == "" || req.Email == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "all_fields_required"))
		return
	}

	// Forwards heavy processing and database rules to the SERVICE.
	user, err := h.userService.Register(req.Name, req.Email, req.Password)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), err.Error()))
		return
	}

	// We return HTTP status 201 (Created) and the object in JSON.
	response.JSON(w, http.StatusCreated, user)
}

// LoginRequest maps credentials coming from the frontend.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login is the endpoint POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return
	}

	// Triggers the service to perform login, compare hash, generate token, etc.
	token, user, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), err.Error()))
		return
	}

	// We prepare the response. In PHP, we would make an associative array ['token' => $token, 'user' => $user].
	// In Go we use map[string]interface{}.
	data := map[string]interface{}{
		"token": token,
		"user":  user,
	}

	response.JSON(w, http.StatusOK, data)
}
