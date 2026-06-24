package repository

import (
	"backend/internal/domain"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedDatabase popula o banco de dados com dados iniciais para testes.
// Em Laravel, isso seria equivalente às classes dentro de database/seeders/.
func SeedDatabase(db *gorm.DB) {
	var count int64
	db.Model(&domain.User{}).Count(&count)

	// Só roda o seeder se o banco estiver vazio (0 usuários)
	if count > 0 {
		return
	}

	log.Println("🌱 Executando Seeders: Populando banco com dados de teste...")

	// 1. Criar Usuário de Teste
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	user := domain.User{
		Name:         "Usuário de Teste",
		Email:        "teste@teste.com",
		PasswordHash: string(hashedPassword),
	}
	db.Create(&user)

	// 2. Criar Blocos
	blocks := []domain.Block{
		{UserID: user.ID, Title: "Despesas de Casa", Type: "despesa"},
		{UserID: user.ID, Title: "Receitas Mês", Type: "receita"},
	}
	db.Create(&blocks)

	// 3. Criar Itens para os Blocos
	now := time.Now()
	items := []domain.Item{
		// Itens do Bloco 1 (Casa)
		{BlockID: blocks[0].ID, Description: "Conta de Luz", Amount: 150.00, IsPaid: true, DueDate: &now},
		{BlockID: blocks[0].ID, Description: "Condomínio", Amount: 850.00, IsPaid: false, DueDate: &now},
		{BlockID: blocks[0].ID, Description: "Internet", Amount: 120.00, IsPaid: false, DueDate: &now},
		
		// Itens do Bloco 2 (Receitas)
		{BlockID: blocks[1].ID, Description: "Salário", Amount: 5000.00, IsPaid: true, DueDate: &now},
		{BlockID: blocks[1].ID, Description: "Freelance em Go", Amount: 1500.00, IsPaid: true, DueDate: &now},
	}
	db.Create(&items)

	log.Println("✅ Seeders finalizados! Use teste@teste.com / 123456 para logar.")
}
