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

// AuthMiddleware intercepts requests to validate the JWT Token.
// Equivalent to `Route::middleware('auth:api')` in Laravel.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Get the Authorization header ("Authorization: Bearer <token>")
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "missing_token"))
			return
		}

		// 2. Remove the "Bearer " prefix
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "invalid_token_format"))
			return
		}
		tokenString := parts[1]

		// 3. Validate Token signature
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
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

		// 4. Extract claims that we put inside the token during Login
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Error(w, http.StatusUnauthorized, i18n.T(r.Context(), "read_token_error"))
			return
		}

		// 5. Context: In Go, we don't have global access to the logged in user via `Auth::user()`.
		// We get the user ID and "inject" it into the request context
		// so that the Handler down the line can read whose request this is.
		userID := uint(claims["user_id"].(float64)) // JSON converts numbers to float64

		ctx := context.WithValue(r.Context(), "user_id", userID)
		
		// Pass the request forward, now carrying the updated Context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
