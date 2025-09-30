package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Attendee struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	SummaryID   uuid.UUID `gorm:"type:uuid;not null;index" json:"summary_id"`
	Email       string    `gorm:"not null" json:"email"`
	Name        string    `json:"name"`
	IsOrganizer bool      `gorm:"default:false" json:"is_organizer"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	Summary Summary `gorm:"foreignKey:SummaryID" json:"summary,omitempty"`
}

func (a *Attendee) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}