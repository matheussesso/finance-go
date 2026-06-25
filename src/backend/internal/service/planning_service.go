package service

import (
	"backend/internal/domain"
	"errors"
	"time"
)

type PlanningService struct {
	repo domain.PlanningRepository
}

func NewPlanningService(repo domain.PlanningRepository) *PlanningService {
	return &PlanningService{repo: repo}
}

func (s *PlanningService) CreatePlanning(userID uint, title string, month int, year int) (*domain.Planning, error) {
	if title == "" {
		return nil, errors.New("o título do planejamento não pode estar vazio")
	}
	if month < 1 || month > 12 {
		return nil, errors.New("mês inválido")
	}

	planning := &domain.Planning{
		UserID: userID,
		Title:  title,
		Month:  month,
		Year:   year,
	}

	err := s.repo.Create(planning)
	if err != nil {
		return nil, errors.New("erro ao criar planejamento no banco")
	}

	return planning, nil
}

func (s *PlanningService) GetPlanningByID(id uint, userID uint) (*domain.Planning, error) {
	planning, err := s.repo.GetByID(id, userID)
	if err != nil {
		return nil, errors.New("planejamento não encontrado")
	}
	return planning, nil
}

func (s *PlanningService) GetAllPlannings(userID uint) ([]domain.Planning, error) {
	plannings, err := s.repo.GetAllByUser(userID)
	if err != nil {
		return nil, errors.New("erro ao buscar planejamentos")
	}

	// Se não tiver planejamentos, podemos criar o do mês atual automaticamente?
	if len(plannings) == 0 {
		now := time.Now()
		defaultPlanning, err := s.CreatePlanning(userID, "Planejamento Atual", int(now.Month()), now.Year())
		if err == nil {
			return []domain.Planning{*defaultPlanning}, nil
		}
	}

	return plannings, nil
}

func (s *PlanningService) DeletePlanning(id uint, userID uint) error {
	err := s.repo.Delete(id, userID)
	if err != nil {
		return errors.New("erro ao excluir planejamento")
	}
	return nil
}
