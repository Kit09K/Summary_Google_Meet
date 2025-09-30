package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SummaryStatus string

const (
	StatusPending    SummaryStatus = "pending"
	StatusProcessing SummaryStatus = "processing"
	StatusCompleted  SummaryStatus = "completed"
	StatusFailed     SummaryStatus = "failed"
)

type Summary struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID         uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	RecordingID    *uuid.UUID     `gorm:"type:uuid;index" json:"recording_id"`
	MeetingID      *uuid.UUID     `gorm:"type:uuid;index" json:"meeting_id"`
	Title          string         `gorm:"not null" json:"title"`
	Summary        string         `gorm:"type:text" json:"summary"` // Short summary
	Content        string         `gorm:"type:text" json:"content"` // Full content
	Status         SummaryStatus  `gorm:"type:varchar(20);default:'pending';index" json:"status"`
	AIModel        string         `json:"ai_model"`
	ProcessingTime int            `json:"processing_time"` // seconds
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Relations
	User        User         `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Recording   *Recording   `gorm:"foreignKey:RecordingID" json:"recording,omitempty"`
	Meeting     *Meeting     `gorm:"foreignKey:MeetingID" json:"meeting,omitempty"`
	Attendees   []Attendee   `gorm:"foreignKey:SummaryID" json:"attendees,omitempty"`
	ActionItems []ActionItem `gorm:"foreignKey:SummaryID" json:"action_items,omitempty"`
	Tags        []SummaryTag `gorm:"foreignKey:SummaryID" json:"tags,omitempty"`
}

func (s *Summary) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}