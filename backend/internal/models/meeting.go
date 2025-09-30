package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Meeting struct {
	ID               uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID           uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	GoogleCalendarID string         `json:"google_calendar_id"`
	Title            string         `gorm:"not null" json:"title"`
	Description      string         `gorm:"type:text" json:"description"`
	StartTime        time.Time      `gorm:"not null;index" json:"start_time"`
	EndTime          time.Time      `gorm:"not null" json:"end_time"`
	Location         string         `json:"location"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relations
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Summaries []Summary `gorm:"foreignKey:MeetingID" json:"summaries,omitempty"`
}

func (m *Meeting) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}