package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SummaryTag struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	SummaryID uuid.UUID `gorm:"type:uuid;not null;index" json:"summary_id"`
	Tag       string    `gorm:"not null" json:"tag"`
	CreatedAt time.Time `json:"created_at"`
	
	// Relations
	Summary Summary `gorm:"foreignKey:SummaryID" json:"summary,omitempty"`
}

func (s *SummaryTag) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}