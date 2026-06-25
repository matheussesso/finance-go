package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type itemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) domain.ItemRepository {
	return &itemRepository{db}
}

// Create saves a new item.
func (r *itemRepository) Create(item *domain.Item) error {
	return r.db.Create(item).Error
}

// Update saves changes to an existing item.
func (r *itemRepository) Update(item *domain.Item) error {
	return r.db.Save(item).Error
}

// Delete removes a specific item.
func (r *itemRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Item{}, id).Error
}
