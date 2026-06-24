package handler

import (
	"backend/internal/service"
	"backend/pkg/response"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type BlockHandler struct {
	blockService *service.BlockService
}

func NewBlockHandler(blockService *service.BlockService) *BlockHandler {
	return &BlockHandler{blockService: blockService}
}

type CreateBlockRequest struct {
	Title string `json:"title"`
	Type  string `json:"type"`
}

// Create cria um novo bloco associado ao usuário logado.
func (h *BlockHandler) Create(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID do usuário do Contexto (injetado pelo AuthMiddleware)
	userID := r.Context().Value("user_id").(uint)

	var req CreateBlockRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Payload inválido")
		return
	}

	block, err := h.blockService.CreateBlock(userID, req.Title, req.Type)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, block)
}

// List retorna todos os blocos do usuário logado, junto com seus itens.
func (h *BlockHandler) List(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	blocks, err := h.blockService.GetUserBlocks(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Erro ao buscar blocos")
		return
	}

	response.JSON(w, http.StatusOK, blocks)
}

// Delete exclui um bloco e seus itens.
func (h *BlockHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	
	// Pega o ID da URL (ex: /api/blocks/5)
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "ID de bloco inválido")
		return
	}

	if err := h.blockService.DeleteBlock(uint(id), userID); err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Bloco excluído com sucesso"})
}
