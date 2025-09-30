package database

import (
	"fmt"
	"log"
	
	"backend/internal/config"
	"backend/internal/models"
	
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect(cfg *config.Config) error {
	var err error
	
	// Configure GORM logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}
	
	// Connect to PostgreSQL
	DB, err = gorm.Open(postgres.Open(cfg.Database.URL), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}
	
	log.Println("✅ Database connection established")
	
	// Get underlying SQL DB
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}
	
	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	
	return nil
}

func Migrate() error {
	log.Println("🔄 Running database migrations...")
	
	// Enable UUID extension
	DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
	
	// Auto migrate all models
	err := DB.AutoMigrate(
		&models.User{},
		&models.Recording{},
		&models.Meeting{},
		&models.Summary{},
		&models.Attendee{},
		&models.ActionItem{},
		&models.SummaryTag{},
	)
	
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}
	
	log.Println("✅ Database migrations completed")
	return nil
}

func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}