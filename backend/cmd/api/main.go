package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	
	"backend/internal/config"
	"backend/internal/database"
	"backend/internal/router"

	"github.com/gin-contrib/sessions"
    "github.com/gin-contrib/sessions/cookie"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()
	
	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)
	
	// Connect to database
	if err := database.Connect(cfg); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	
	// Initialize router
	r := router.SetupRouter(cfg)
	
    // setup session store
    store := cookie.NewStore([]byte(cfg.Session.Secret))
    r.Use(sessions.Sessions("mysession", store))

    router.SetupRouter(cfg, r)

    r.Run(":" + cfg.Server.Port)
    
	// Start server
	addr := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("Server starting on http://localhost%s", addr)
	log.Printf("API Version: %s", cfg.Server.APIVersion)
	log.Printf("Environment: %s", cfg.Server.GinMode)

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	
	log.Println("Shutting down server...")
	
	// Close database connection
	if err := database.Close(); err != nil {
		log.Printf("Error closing database: %v", err)
	}
	
	log.Println("Server stopped gracefully")
}