package repository

import (
	"backend/internal/domain"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// ConnectDB establishes a connection with MariaDB and performs automatic migrations.
// Returns a pointer to the gorm.DB instance or an error if the connection fails.
func ConnectDB(dsn string) (*gorm.DB, error) {
	// The gorm.Open function tries to connect to the database. If it fails, 'err' will be different from nil.
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		// %w embeds the original error inside our new error (useful for future debugging)
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Connection to MariaDB established successfully!")

	// AutoMigrate works similarly to "php artisan migrate".
	// It reads the Go domain structs and automatically recreates/alters 
	// the tables (CREATE TABLE, ADD COLUMN) to reflect the structs.
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Block{},
		&domain.Item{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed database migration: %w", err)
	}

	log.Println("Tables migrated successfully!")

	return db, nil
}
