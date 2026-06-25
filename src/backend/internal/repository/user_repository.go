package repository

import (
	"backend/internal/domain"
	"errors"

	"gorm.io/gorm"
)

// userRepository is a private struct (starts with lowercase letter).
// In Go, this is similar to a "private" class in PHP. It hides the
// database connection (gorm.DB) from the rest of the system.
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository acts like a "Constructor" in PHP. 
// It receives the database connection and returns the `domain.UserRepository` interface.
// Returning the interface ensures decoupling: the Service doesn't know if we are using
// GORM, MySQL or an in-memory array, it only knows that methods like Create, FindByEmail exist.
func NewUserRepository(db *gorm.DB) domain.UserRepository {
	// We return a pointer (&) to the instantiated struct.
	return &userRepository{db}
}

// Create inserts a new user into the database.
// The parameter `user *domain.User` is a pointer (similar to pass-by-reference in PHP).
// Any changes GORM makes to `user` (like filling the auto-increment ID)
// will reflect on the original object back in the Service.
func (r *userRepository) Create(user *domain.User) error {
	// r.db.Create receives the user pointer and generates the INSERT INTO users ...
	return r.db.Create(user).Error
}

// FindByEmail searches for a user by email address.
// Returns a pointer to the user (*domain.User) and an error (error).
// Unlike PHP where we would throw an Exception (throw new Exception), 
// in Go we return the error as a secondary value.
func (r *userRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	
	// Executes the query: SELECT * FROM users WHERE email = ? LIMIT 1
	err := r.db.Where("email = ?", email).First(&user).Error
	
	if err != nil {
		// If the error is "RecordNotFound" (didn't find the email), we don't consider it a fatal failure,
		// we just return nil (null) for the user, meaning they don't exist.
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		// If it's a real error (db down, etc), we return the error.
		return nil, err
	}
	
	// Returns the memory address (&user) containing the data loaded from the database.
	return &user, nil
}

// FindByID searches for a user by their Primary Key.
func (r *userRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
