package repository

import (
	"backend/internal/domain"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// ConnectDB estabelece conexão com o MariaDB e realiza as migrations automáticas.
// Retorna um ponteiro para a instância do gorm.DB ou um erro caso a conexão falhe.
func ConnectDB(dsn string) (*gorm.DB, error) {
	// A função gorm.Open tenta conectar ao banco. Se falhar, o 'err' será diferente de nil.
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		// %w embute o erro original dentro do nosso novo erro (útil para debugs futuros)
		return nil, fmt.Errorf("falha ao conectar ao banco de dados: %w", err)
	}

	log.Println("Conexão com MariaDB estabelecida com sucesso!")

	// AutoMigrate funciona semelhante ao "php artisan migrate".
	// Ele lê as structs do domínio em Go e recria/altera as tabelas 
	// (CREATE TABLE, ADD COLUMN) automaticamente para refletir as structs.
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Block{},
		&domain.Item{},
	)
	if err != nil {
		return nil, fmt.Errorf("falha na migração do banco: %w", err)
	}

	log.Println("Tabelas migradas com sucesso!")

	return db, nil
}
