package repository

import (
	"backend/internal/domain"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedDatabase populates the database with initial data for testing.
// In Laravel, this would be equivalent to classes inside database/seeders/.
func SeedDatabase(db *gorm.DB) {
	var count int64
	db.Model(&domain.User{}).Count(&count)

	// Only run the seeder if the database is empty (0 users)
	if count > 0 {
		return
	}

	log.Println("🌱 Running Seeders: Populating database with test data...")

	// 1. Create Test User
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	user := domain.User{
		Name:         "Usuário de Teste",
		Email:        "teste@teste.com",
		PasswordHash: string(hashedPassword),
	}
	db.Create(&user)

	// 2. Create Base Planning
	now := time.Now()
	planning := domain.Planning{
		UserID: user.ID,
		Title:  "Planejamento Atual",
		Month:  int(now.Month()),
		Year:   now.Year(),
	}
	db.Create(&planning)

	// 3. Create Blocks
	blocks := []domain.Block{
		{UserID: user.ID, PlanningID: planning.ID, Title: "Despesas de Casa", Type: "expense"},
		{UserID: user.ID, PlanningID: planning.ID, Title: "Receitas Mês", Type: "revenue"},
	}
	db.Create(&blocks)

	// 3. Create Items for Blocks
	now = time.Now()
	items := []domain.Item{
		// Block 1 Items (Home)
		{BlockID: blocks[0].ID, Description: "Conta de Luz", Amount: 150.00, IsPaid: true, DueDate: &now},
		{BlockID: blocks[0].ID, Description: "Condomínio", Amount: 850.00, IsPaid: false, DueDate: &now},
		{BlockID: blocks[0].ID, Description: "Internet", Amount: 120.00, IsPaid: false, DueDate: &now},
		
		// Block 2 Items (Revenues)
		{BlockID: blocks[1].ID, Description: "Salário", Amount: 5000.00, IsPaid: true, DueDate: &now},
		{BlockID: blocks[1].ID, Description: "Freelance em Go", Amount: 1500.00, IsPaid: true, DueDate: &now},
	}
	db.Create(&items)

	log.Println("✅ Seeders finished! Use teste@teste.com / 123456 to login.")
}
