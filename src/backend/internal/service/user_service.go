package service

import (
	"backend/internal/domain"
	"errors"
	"time"

	"os"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// UserService encapsula toda a regra de negócio relacionada aos usuários.
// É o equivalente às classes "Services" ou "Actions" comuns no Laravel.
type UserService struct {
	// Dependência do repositório (Interface). Facilita testes unitários (Mock).
	repo domain.UserRepository
}

// NewUserService é a função construtora. Injeta a dependência do repositório.
func NewUserService(repo domain.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// Register valida as regras de negócio antes de criar o usuário no banco.
// Parâmetros: name, email, password string
// Retorno: *domain.User (sucesso) ou error (se algo falhar).
func (s *UserService) Register(name, email, password string) (*domain.User, error) {
	// 1. Regra de Negócio: E-mail não pode ser duplicado
	existingUser, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email_exists") // "Exception" controlada
	}

	// 2. Regra de Negócio: Senhas não podem ser salvas em texto limpo.
	// O bcrypt.GenerateFromPassword faz o papel do Hash::make($password) do Laravel.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("process_password_error")
	}

	// 3. Monta a entidade
	user := &domain.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hashedPassword),
	}

	// 4. Salva no banco através do repositório
	if err := s.repo.Create(user); err != nil {
		return nil, errors.New("user_create_error")
	}

	return user, nil
}

// Login verifica as credenciais do usuário e retorna um Token JWT.
// Retorno: string (token), *domain.User (dados do usuário logado), error
func (s *UserService) Login(email, password string) (string, *domain.User, error) {
	// 1. Busca usuário pelo e-mail
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", nil, err
	}
	
	// Se o user for nil, significa que a query não encontrou nada.
	if user == nil {
		return "", nil, errors.New("invalid_credentials")
	}

	// 2. Compara a senha informada com o Hash do banco (Auth::attempt no Laravel)
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", nil, errors.New("invalid_credentials")
	}

	// 3. Gera o Token JWT contendo o ID do usuário como "claim" (carga útil)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Expira em 72 horas
	})

	// 4. Assina o token com nossa chave secreta
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "fallback_secret_local" // Para dev caso o .env não seja carregado
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", nil, errors.New("token_generate_error")
	}

	return tokenString, user, nil
}
