package middleware

import (
	"context"
	"net/http"
)

// LanguageMiddleware extracts the Accept-Language header and injects it into context
func LanguageMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lang := r.Header.Get("Accept-Language")
		if lang == "" {
			lang = "pt"
		}
		
		ctx := context.WithValue(r.Context(), "lang", lang)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
