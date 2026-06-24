package domain

import (
	"time"
)

// User representa o dono das finanças
type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"type:varchar(255);not null"`
	Email        string    `json:"email" gorm:"type:varchar(255);unique;not null"`
	PasswordHash string    `json:"-" gorm:"type:varchar(255);not null"` // "-" impede que a senha vaze no JSON
	CreatedAt    time.Time `json:"created_at"`
	Blocks       []Block   `json:"blocks,omitempty" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// UserRepository define os contratos para acesso ao BD de usuários
type UserRepository interface {
	Create(user *User) error
	FindByEmail(email string) (*User, error)
	FindByID(id uint) (*User, error)
}
