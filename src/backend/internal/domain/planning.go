package domain

import "time"

// Planning represents a planning cycle (e.g., "June 2026", "Wedding")
// It groups several Blocks.
type Planning struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null;size:255"`
	Month     int       `json:"month"` // Optional to facilitate filtering (1-12)
	Year      int       `json:"year"`  // Optional to facilitate filtering
	Blocks    []Block   `json:"blocks" gorm:"foreignKey:PlanningID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PlanningRepository defines the contracts for accessing the planning DB
type PlanningRepository interface {
	Create(planning *Planning) error
	GetByID(id uint, userID uint) (*Planning, error)
	GetAllByUser(userID uint) ([]Planning, error)
	Update(planning *Planning) error
	Delete(id uint, userID uint) error
}
