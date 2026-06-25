package service

import (
	"backend/internal/domain"
	"errors"
	"time"

	"os"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// UserService encapsulates all business rules related to users.
// It is equivalent to "Services" or "Actions" classes commonly found in Laravel.
type UserService struct {
	// Repository dependency (Interface). Makes unit testing easier (Mock).
	repo domain.UserRepository
}

// NewUserService is the constructor function. It injects the repository dependency.
func NewUserService(repo domain.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// Register validates business rules before creating the user in the database.
// Parameters: name, email, password string
// Return: *domain.User (success) or error (if something fails).
func (s *UserService) Register(name, email, password string) (*domain.User, error) {
	// 1. Business Rule: Email cannot be duplicated
	existingUser, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email_exists") // Controlled "Exception"
	}

	// 2. Business Rule: Passwords cannot be saved as plain text.
	// bcrypt.GenerateFromPassword acts like Hash::make($password) in Laravel.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("process_password_error")
	}

	// 3. Assemble the entity
	user := &domain.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hashedPassword),
	}

	// 4. Save to the database via the repository
	if err := s.repo.Create(user); err != nil {
		return nil, errors.New("user_create_error")
	}

	return user, nil
}

// Login checks user credentials and returns a JWT Token.
// Return: string (token), *domain.User (logged-in user data), error
func (s *UserService) Login(email, password string) (string, *domain.User, error) {
	// 1. Search user by email
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", nil, err
	}
	
	// If user is nil, it means the query didn't find anything.
	if user == nil {
		return "", nil, errors.New("invalid_credentials")
	}

	// 2. Compare provided password with database Hash (Auth::attempt in Laravel)
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", nil, errors.New("invalid_credentials")
	}

	// 3. Generate JWT Token containing user ID as a "claim" (payload)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Expires in 72 hours
	})

	// 4. Sign the token with our secret key
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "fallback_secret_local" // For dev in case .env is not loaded
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", nil, errors.New("token_generate_error")
	}

	return tokenString, user, nil
}
