package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	GoogleID       string         `gorm:"uniqueIndex;not null" json:"google_id"`
	Email          string         `gorm:"uniqueIndex;not null" json:"email"`
	Name           string         `json:"name"`
	Avatar         string         `json:"avatar"`
	RefreshToken   string         `gorm:"type:text" json:"-"` // Encrypted, don't expose in JSON
	TokenExpiresAt *time.Time     `json:"token_expires_at"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relations
	Recordings []Recording `gorm:"foreignKey:UserID" json:"recordings,omitempty"`
	Meetings   []Meeting   `gorm:"foreignKey:UserID" json:"meetings,omitempty"`
	Summaries  []Summary   `gorm:"foreignKey:UserID" json:"summaries,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

