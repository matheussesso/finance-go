package repository

import (
	"backend/internal/domain"

	"gorm.io/gorm"
)

type planningRepository struct {
	db *gorm.DB
}

// NewPlanningRepository creates the repository instance by injecting the database.
func NewPlanningRepository(db *gorm.DB) domain.PlanningRepository {
	return &planningRepository{db: db}
}

func (r *planningRepository) Create(planning *domain.Planning) error {
	return r.db.Create(planning).Error
}

func (r *planningRepository) GetByID(id uint, userID uint) (*domain.Planning, error) {
	var planning domain.Planning
	// Preload fetches the blocks and associated items in a single query (Eager Loading)
	err := r.db.Preload("Blocks.Items").Where("id = ? AND user_id = ?", id, userID).First(&planning).Error
	if err != nil {
		return nil, err
	}
	return &planning, nil
}

func (r *planningRepository) GetAllByUser(userID uint) ([]domain.Planning, error) {
	var plannings []domain.Planning
	err := r.db.Where("user_id = ?", userID).Order("year DESC, month DESC").Find(&plannings).Error
	return plannings, err
}

func (r *planningRepository) Update(planning *domain.Planning) error {
	return r.db.Save(planning).Error
}

func (r *planningRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Planning{}).Error
}
