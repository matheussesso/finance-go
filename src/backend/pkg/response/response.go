package response

import (
	"encoding/json"
	"net/http"
)

// StandardResponse is the consistent return format for all routes
type StandardResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// JSON sends a successful JSON response
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(StandardResponse{
		Success: true,
		Data:    data,
	})
}

// Error sends an error JSON response
func Error(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(StandardResponse{
		Success: false,
		Message: message,
	})
}
