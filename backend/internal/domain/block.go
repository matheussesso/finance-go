package domain

import (
	"time"
)

// Block representa um grupo de finanças (ex: "Dívida / Credor", "Contas Mãe")
type Block struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"type:varchar(255);not null"`
	Type      string    `json:"type" gorm:"type:varchar(50);not null"` // ex: despesa, receita, planejamento
	CreatedAt time.Time `json:"created_at"`
	Items     []Item    `json:"items,omitempty" gorm:"foreignKey:BlockID;constraint:OnDelete:CASCADE"`
}

// BlockRepository define os contratos para acesso ao BD de blocos
type BlockRepository interface {
	Create(block *Block) error
	FindAllByUserID(userID uint) ([]Block, error)
	FindByID(id uint, userID uint) (*Block, error)
	Update(block *Block) error
	Delete(id uint, userID uint) error
}
