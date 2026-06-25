package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type blockRepository struct {
	db *gorm.DB
}

func NewBlockRepository(db *gorm.DB) domain.BlockRepository {
	return &blockRepository{db}
}

// Create saves a new Block in the database.
func (r *blockRepository) Create(block *domain.Block) error {
	return r.db.Create(block).Error
}

// FindAllByUserID fetches all blocks of a specific user,
// along with the Items inside that block (GORM Eager Loading using Preload).
// Equivalent to PHP: Block::with('items')->where('user_id', $userId)->get();
func (r *blockRepository) FindAllByUserID(userID uint) ([]domain.Block, error) {
	var blocks []domain.Block
	err := r.db.Preload("Items").Where("user_id = ?", userID).Find(&blocks).Error
	return blocks, err
}

// FindByID searches for a specific block of a user.
// Passing the userID here is an essential security lock (so we don't access others' blocks).
func (r *blockRepository) FindByID(id uint, userID uint) (*domain.Block, error) {
	var block domain.Block
	err := r.db.Preload("Items").Where("id = ? AND user_id = ?", id, userID).First(&block).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &block, nil
}

// Update saves changes to a Block.
func (r *blockRepository) Update(block *domain.Block) error {
	return r.db.Save(block).Error
}

// Delete removes a block. GORM configured with OnDelete:CASCADE will delete child items in the DB.
func (r *blockRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Block{}).Error
}
