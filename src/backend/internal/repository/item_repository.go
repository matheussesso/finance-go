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

// Create salva um novo item.
func (r *itemRepository) Create(item *domain.Item) error {
	return r.db.Create(item).Error
}

// Update salva alterações de um item existente.
func (r *itemRepository) Update(item *domain.Item) error {
	return r.db.Save(item).Error
}

// Delete exclui um item específico.
func (r *itemRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Item{}, id).Error
}
