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

// NewItemService also receives the blockRepo to validate if the block belongs to the logged-in user.
func NewItemService(itemRepo domain.ItemRepository, blockRepo domain.BlockRepository) *ItemService {
	return &ItemService{
		itemRepo:  itemRepo,
		blockRepo: blockRepo,
	}
}

func (s *ItemService) CreateItem(userID uint, blockID uint, description string, amount float64, isPaid bool, dueDate *time.Time) (*domain.Item, error) {
	if description == "" || amount < 0 {
		return nil, errors.New("item_invalid_desc_amount")
	}

	// 1. Security Validation: Does the block belong to this user?
	block, err := s.blockRepo.FindByID(blockID, userID)
	if err != nil {
		return nil, err
	}
	if block == nil {
		return nil, errors.New("block_not_found")
	}

	item := &domain.Item{
		BlockID:     blockID,
		Description: description,
		Amount:      amount,
		IsPaid:      isPaid,
		DueDate:     dueDate,
	}

	if err := s.itemRepo.Create(item); err != nil {
		return nil, errors.New("item_create_error")
	}

	return item, nil
}

func (s *ItemService) DeleteItem(userID uint, itemID uint, blockID uint) error {
	// 1. Cross-check security: does the block belong to the user?
	block, err := s.blockRepo.FindByID(blockID, userID)
	if err != nil || block == nil {
		return errors.New("block_not_found")
	}

	// 2. Delete the item
	return s.itemRepo.Delete(itemID)
}
