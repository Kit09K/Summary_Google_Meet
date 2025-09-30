package repository

import (
	"backend/internal/database"
	"backend/internal/models"
	
	"github.com/google/uuid"
)

type SummaryRepository struct{}

func NewSummaryRepository() *SummaryRepository {
	return &SummaryRepository{}
}

func (r *SummaryRepository) Create(summary *models.Summary) error {
	return database.DB.Create(summary).Error
}

func (r *SummaryRepository) FindByID(id uuid.UUID) (*models.Summary, error) {
	var summary models.Summary
	err := database.DB.
		Preload("User").
		Preload("Recording").
		Preload("Meeting").
		Preload("Attendees").
		Preload("ActionItems").
		Preload("Tags").
		First(&summary, "id = ?", id).Error
	return &summary, err
}

func (r *SummaryRepository) FindByUserID(userID uuid.UUID, limit, offset int) ([]models.Summary, error) {
	var summaries []models.Summary
	err := database.DB.
		Where("user_id = ?", userID).
		Preload("Attendees").
		Preload("ActionItems").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&summaries).Error
	return summaries, err
}

func (r *SummaryRepository) Update(summary *models.Summary) error {
	return database.DB.Save(summary).Error
}

func (r *SummaryRepository) Delete(id uuid.UUID) error {
	return database.DB.Delete(&models.Summary{}, "id = ?", id).Error
}

func (r *SummaryRepository) CreateAttendee(attendee *models.Attendee) error {
	return database.DB.Create(attendee).Error
}

func (r *SummaryRepository) FindAttendeesBySummaryID(summaryID uuid.UUID) ([]models.Attendee, error) {
	var attendees []models.Attendee
	err := database.DB.Where("summary_id = ?", summaryID).Find(&attendees).Error
	return attendees, err
}

func (r *SummaryRepository) CreateActionItem(item *models.ActionItem) error {
	return database.DB.Create(item).Error
}

func (r *SummaryRepository) FindActionItemsBySummaryID(summaryID uuid.UUID) ([]models.ActionItem, error) {
	var items []models.ActionItem
	err := database.DB.Where("summary_id = ?", summaryID).Find(&items).Error
	return items, err
}

func (r *SummaryRepository) UpdateActionItem(item *models.ActionItem) error {
	return database.DB.Save(item).Error
}