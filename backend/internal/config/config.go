package config

import (
	"log"
	"os"
	
	"github.com/joho/godotenv"
)

type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	Google   GoogleConfig
	CORS     CORSConfig
	Session  SessionConfig
}

type SessionConfig struct {
    Secret string
}

type DatabaseConfig struct {
	URL string
}

type ServerConfig struct {
	Port       string
	GinMode    string
	APIVersion string
}

type GoogleConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

type CORSConfig struct {
	AllowedOrigins []string
}

func LoadConfig() *Config {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}
	
	return &Config{
		Database: DatabaseConfig{
			URL: getEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/mydatabase?sslmode=disable"),
		},
		Server: ServerConfig{
			Port:       getEnv("PORT", "8080"),
			GinMode:    getEnv("GIN_MODE", "debug"),
			APIVersion: getEnv("API_VERSION", "v1"),
		},
		Session: SessionConfig{
			Secret: getEnv("SESSION_SECRET", "super-secret-key"),
		},
		Google: GoogleConfig{
			ClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
			ClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
			RedirectURL:  getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8080/api/v1/auth/google/callback"),
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{
				getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
			},
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
