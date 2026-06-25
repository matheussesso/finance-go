package domain

import (
	"time"
)

// User represents the owner of the finances
type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"type:varchar(255);not null"`
	Email        string    `json:"email" gorm:"type:varchar(255);unique;not null"`
	PasswordHash string    `json:"-" gorm:"type:varchar(255);not null"` // "-" prevents the password from leaking in JSON
	CreatedAt    time.Time `json:"created_at"`
	Blocks       []Block   `json:"blocks,omitempty" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// UserRepository defines the contracts for accessing the user DB
type UserRepository interface {
	Create(user *User) error
	FindByEmail(email string) (*User, error)
	FindByID(id uint) (*User, error)
}
