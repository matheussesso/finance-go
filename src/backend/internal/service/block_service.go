package service

import (
	"backend/internal/domain"
	"errors"
)

// BlockService gerencia as regras de negócio dos Blocos de Finanças.
type BlockService struct {
	repo domain.BlockRepository
}

func NewBlockService(repo domain.BlockRepository) *BlockService {
	return &BlockService{repo: repo}
}

func (s *BlockService) CreateBlock(userID uint, planningID uint, title string, blockType string) (*domain.Block, error) {
	if title == "" || blockType == "" {
		return nil, errors.New("block_title_type_required")
	}

	block := &domain.Block{
		UserID:     userID,
		PlanningID: planningID,
		Title:      title,
		Type:       blockType,
	}

	if err := s.repo.Create(block); err != nil {
		return nil, errors.New("block_create_error")
	}

	return block, nil
}

func (s *BlockService) GetUserBlocks(userID uint) ([]domain.Block, error) {
	return s.repo.FindAllByUserID(userID)
}

func (s *BlockService) DeleteBlock(id uint, userID uint) error {
	// 1. Verifica se o bloco existe e pertence a este usuário
	block, err := s.repo.FindByID(id, userID)
	if err != nil {
		return err
	}
	if block == nil {
		return errors.New("block_not_found")
	}

	// 2. Apaga o bloco
	return s.repo.Delete(id, userID)
}
