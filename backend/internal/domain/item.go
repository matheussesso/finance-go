package domain

import (
	"time"
)

// Item representa uma linha de finança dentro de um bloco (ex: "Banco do Brasil", valor 900.00)
type Item struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	BlockID     uint       `json:"block_id" gorm:"not null"`
	Description string     `json:"description" gorm:"type:varchar(255);not null"`
	Amount      float64    `json:"amount" gorm:"type:decimal(10,2);not null"`
	IsPaid      bool       `json:"is_paid" gorm:"default:false"`
	IsRecurring bool       `json:"is_recurring" gorm:"default:false"` // Identifica contas fixas (Netflix, Aluguel)
	DueDate     *time.Time `json:"due_date,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// ItemRepository define os contratos para acesso ao BD de itens
type ItemRepository interface {
	Create(item *Item) error
	Update(item *Item) error
	Delete(id uint) error
}
