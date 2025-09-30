package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ActionItemStatus string
type Priority string

const (
	ActionPending    ActionItemStatus = "pending"
	ActionInProgress ActionItemStatus = "in_progress"
	ActionCompleted  ActionItemStatus = "completed"
	
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

type ActionItem struct {
	ID          uuid.UUID        `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	SummaryID   uuid.UUID        `gorm:"type:uuid;not null;index" json:"summary_id"`
	Description string           `gorm:"type:text;not null" json:"description"`
	Assignee    string           `json:"assignee"` // email
	DueDate     *time.Time       `json:"due_date"`
	Status      ActionItemStatus `gorm:"type:varchar(20);default:'pending';index" json:"status"`
	Priority    Priority         `gorm:"type:varchar(10);default:'medium'" json:"priority"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	
	// Relations
	Summary Summary `gorm:"foreignKey:SummaryID" json:"summary,omitempty"`
}

func (a *ActionItem) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}