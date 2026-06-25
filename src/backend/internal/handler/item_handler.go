package handler

import (
	"backend/internal/service"
	"backend/pkg/i18n"
	"backend/pkg/response"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

type ItemHandler struct {
	itemService *service.ItemService
}

func NewItemHandler(itemService *service.ItemService) *ItemHandler {
	return &ItemHandler{itemService: itemService}
}

type CreateItemRequest struct {
	BlockID     uint       `json:"block_id"`
	Description string     `json:"description"`
	Amount      float64    `json:"amount"`
	IsPaid      bool       `json:"is_paid"`
	DueDate     *time.Time `json:"due_date"`
}

func (h *ItemHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var req CreateItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return
	}

	item, err := h.itemService.CreateItem(userID, req.BlockID, req.Description, req.Amount, req.IsPaid, req.DueDate)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusCreated, item)
}

func (h *ItemHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	
	itemID, _ := strconv.ParseUint(chi.URLParam(r, "id"), 10, 32)
	blockID, _ := strconv.ParseUint(chi.URLParam(r, "block_id"), 10, 32) // assumindo rotas aninhadas ou params query

	if err := h.itemService.DeleteItem(userID, uint(itemID), uint(blockID)); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "success"})
}
