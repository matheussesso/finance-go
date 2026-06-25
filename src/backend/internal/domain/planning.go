package domain

import "time"

// Planning representa um ciclo de planejamento (ex: "Junho 2026", "Casamento")
// Ele agrupa diversos Blocos (Blocks).
type Planning struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null;size:255"`
	Month     int       `json:"month"` // Opcional para facilitar filtros (1-12)
	Year      int       `json:"year"`  // Opcional para facilitar filtros
	Blocks    []Block   `json:"blocks" gorm:"foreignKey:PlanningID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PlanningRepository define os contratos para acesso ao BD de planejamentos
type PlanningRepository interface {
	Create(planning *Planning) error
	GetByID(id uint, userID uint) (*Planning, error)
	GetAllByUser(userID uint) ([]Planning, error)
	Update(planning *Planning) error
	Delete(id uint, userID uint) error
}
