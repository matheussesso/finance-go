package middleware

import (
	"backend/pkg/response"
	"backend/pkg/i18n"
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware intercepta requisições para validar o Token JWT.
// Equivalente ao `Route::middleware('auth:api')` no Laravel.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Pega o header de Autorização ("Authorization: Bearer <token>")
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "missing_token"))
			return
		}

		// 2. Remove o prefixo "Bearer "
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "invalid_token_format"))
			return
		}
		tokenString := parts[1]

		// 3. Valida a assinatura do Token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de assinatura inesperado")
			}
			
			secret := os.Getenv("JWT_SECRET")
			if secret == "" {
				secret = "fallback_secret_local"
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "invalid_token"))
			return
		}

		// 4. Extrai os dados (claims) que colocamos dentro do token lá no Login
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "read_token_error"))
			return
		}

		// 5. Contexto: No Go, não temos acesso global ao usuário logado via `Auth::user()`.
		// Nós pegamos o ID do usuário e "injetamos" no contexto da requisição (Context)
		// para que o Handler lá na frente consiga ler de quem é essa requisição.
		userID := uint(claims["user_id"].(float64)) // JSON converte números pra float64

		ctx := context.WithValue(r.Context(), "user_id", userID)
		
		// Passa a requisição adiante, agora carregando o Contexto atualizado
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
