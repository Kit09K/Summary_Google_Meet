// internal/models/recording.go
package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Recording struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID         uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	GoogleDriveID  string         `gorm:"uniqueIndex" json:"google_drive_id"`
	Name           string         `gorm:"not null" json:"name"`
	MimeType       string         `json:"mime_type"`
	Size           int64          `json:"size"` // bytes
	Duration       int            `json:"duration"` // seconds
	WebViewLink    string         `json:"web_view_link"`
	ThumbnailLink  string         `json:"thumbnail_link"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relations
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Summaries []Summary `gorm:"foreignKey:RecordingID" json:"summaries,omitempty"`
}

func (r *Recording) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}