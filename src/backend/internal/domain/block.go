package domain

import (
	"time"
)

// Block represents a group of finances (e.g., "Debt / Creditor", "Main Bills")
type Block struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id" gorm:"not null"`
	PlanningID uint      `json:"planning_id" gorm:"not null"` // Link to the Planning
	Title      string    `json:"title" gorm:"type:varchar(255);not null"`
	Type       string    `json:"type" gorm:"type:varchar(50);not null"` // e.g., expense, revenue, planning
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Items      []Item    `json:"items,omitempty" gorm:"foreignKey:BlockID;constraint:OnDelete:CASCADE"`
}

// BlockRepository defines the contracts for accessing the block DB
type BlockRepository interface {
	Create(block *Block) error
	FindAllByUserID(userID uint) ([]Block, error)
	FindByID(id uint, userID uint) (*Block, error)
	Update(block *Block) error
	Delete(id uint, userID uint) error
}
