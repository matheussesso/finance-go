package repository

import (
	"backend/internal/domain"
	"errors"

	"gorm.io/gorm"
)

// userRepository é uma struct privada (inicia com letra minúscula).
// Em Go, isso é parecido com uma classe "private" no PHP. Ela esconde a
// conexão com o banco de dados (gorm.DB) do resto do sistema.
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository atua como um "Constructor" no PHP. 
// Ele recebe a conexão do banco de dados e retorna a interface `domain.UserRepository`.
// Retornar a interface garante o desacoplamento: o Service não sabe se estamos usando
// GORM, MySQL ou um array em memória, ele só sabe que existem os métodos Create, FindByEmail, etc.
func NewUserRepository(db *gorm.DB) domain.UserRepository {
	// Retornamos um ponteiro (&) para a struct instanciada.
	return &userRepository{db}
}

// Create insere um novo usuário no banco de dados.
// O parâmetro `user *domain.User` é um ponteiro (semelhante à passagem por referência no PHP).
// Qualquer alteração que o GORM fizer no `user` (como preencher o ID gerado pelo auto-increment),
// refletirá no objeto original lá no Service.
func (r *userRepository) Create(user *domain.User) error {
	// r.db.Create recebe o ponteiro do usuário e gera o INSERT INTO users ...
	return r.db.Create(user).Error
}

// FindByEmail busca um usuário pelo endereço de e-mail.
// Retorna um ponteiro para o usuário (*domain.User) e um erro (error).
// Diferente do PHP onde lançaríamos uma Exception (throw new Exception), 
// no Go nós retornamos o erro como um valor secundário.
func (r *userRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	
	// Executa a query: SELECT * FROM users WHERE email = ? LIMIT 1
	err := r.db.Where("email = ?", email).First(&user).Error
	
	if err != nil {
		// Se o erro for "RecordNotFound" (não encontrou o e-mail), não consideramos uma falha fatal,
		// apenas retornamos nil (null) para o usuário, significando que ele não existe.
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		// Se for um erro real (banco caiu, etc), retornamos o erro.
		return nil, err
	}
	
	// Retorna o endereço da memória (&user) contendo os dados carregados do banco.
	return &user, nil
}

// FindByID busca um usuário pela sua Primary Key.
func (r *userRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
