package handler

import (
	"backend/internal/service"
	"backend/pkg/i18n"
	"backend/pkg/response"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type PlanningHandler struct {
	service *service.PlanningService
}

func NewPlanningHandler(service *service.PlanningService) *PlanningHandler {
	return &PlanningHandler{service: service}
}

// Structs for JSON payloads (DTOs)
type CreatePlanningRequest struct {
	Title string `json:"title"`
	Month int    `json:"month"`
	Year  int    `json:"year"`
}

func (h *PlanningHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var req CreatePlanningRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_payload"))
		return
	}

	planning, err := h.service.CreatePlanning(userID, req.Title, req.Month, req.Year)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusCreated, planning)
}

func (h *PlanningHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	plannings, err := h.service.GetAllPlannings(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusOK, plannings)
}

func (h *PlanningHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_id"))
		return
	}

	planning, err := h.service.GetPlanningByID(uint(id), userID)
	if err != nil {
		response.Error(w, http.StatusNotFound, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusOK, planning)
}

func (h *PlanningHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(w, http.StatusBadRequest, i18n.T(r.Context(), "invalid_id"))
		return
	}

	err = h.service.DeletePlanning(uint(id), userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, i18n.T(r.Context(), err.Error()))
		return
	}

	response.JSON(w, http.StatusOK, nil)
}
