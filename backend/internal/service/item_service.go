package service

import (
	"backend/internal/domain"
	"errors"
	"time"
)

type ItemService struct {
	itemRepo  domain.ItemRepository
	blockRepo domain.BlockRepository
}

// NewItemService recebe também o blockRepo para validar se o bloco pertence ao usuário logado.
func NewItemService(itemRepo domain.ItemRepository, blockRepo domain.BlockRepository) *ItemService {
	return &ItemService{
		itemRepo:  itemRepo,
		blockRepo: blockRepo,
	}
}

func (s *ItemService) CreateItem(userID uint, blockID uint, description string, amount float64, isPaid bool, dueDate *time.Time) (*domain.Item, error) {
	if description == "" || amount < 0 {
		return nil, errors.New("descrição inválida ou valor negativo")
	}

	// 1. Validação de Segurança: O bloco pertence a este usuário?
	block, err := s.blockRepo.FindByID(blockID, userID)
	if err != nil {
		return nil, err
	}
	if block == nil {
		return nil, errors.New("bloco não encontrado ou acesso negado")
	}

	item := &domain.Item{
		BlockID:     blockID,
		Description: description,
		Amount:      amount,
		IsPaid:      isPaid,
		DueDate:     dueDate,
	}

	if err := s.itemRepo.Create(item); err != nil {
		return nil, errors.New("falha ao adicionar item")
	}

	return item, nil
}

func (s *ItemService) DeleteItem(userID uint, itemID uint, blockID uint) error {
	// 1. Segurança cruzada: o bloco pertence ao usuário?
	block, err := s.blockRepo.FindByID(blockID, userID)
	if err != nil || block == nil {
		return errors.New("bloco inválido ou negado")
	}

	// 2. Apaga o item
	return s.itemRepo.Delete(itemID)
}
