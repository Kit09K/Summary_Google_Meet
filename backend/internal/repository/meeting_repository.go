package repository

import (
	"backend/internal/database"
	"backend/internal/models"
	"time"
	
	"github.com/google/uuid"
)

type MeetingRepository struct{}

func NewMeetingRepository() *MeetingRepository {
	return &MeetingRepository{}
}

func (r *MeetingRepository) Create(meeting *models.Meeting) error {
	return database.DB.Create(meeting).Error
}

func (r *MeetingRepository) FindByID(id uuid.UUID) (*models.Meeting, error) {
	var meeting models.Meeting
	err := database.DB.Preload("User").First(&meeting, "id = ?", id).Error
	return &meeting, err
}

func (r *MeetingRepository) FindByUserID(userID uuid.UUID, limit, offset int) ([]models.Meeting, error) {
	var meetings []models.Meeting
	err := database.DB.
		Where("user_id = ?", userID).
		Order("start_time DESC").
		Limit(limit).
		Offset(offset).
		Find(&meetings).Error
	return meetings, err
}

func (r *MeetingRepository) FindUpcomingByUserID(userID uuid.UUID, limit int) ([]models.Meeting, error) {
	var meetings []models.Meeting
	now := time.Now()
	err := database.DB.
		Where("user_id = ? AND start_time > ?", userID, now).
		Order("start_time ASC").
		Limit(limit).
		Find(&meetings).Error
	return meetings, err
}

func (r *MeetingRepository) Update(meeting *models.Meeting) error {
	return database.DB.Save(meeting).Error
}

func (r *MeetingRepository) Delete(id uuid.UUID) error {
	return database.DB.Delete(&models.Meeting{}, "id = ?", id).Error
}