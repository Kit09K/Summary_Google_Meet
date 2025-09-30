package repository

import (
	"backend/internal/database"
	"backend/internal/models"
	
	"github.com/google/uuid"
)

type RecordingRepository struct{}

func NewRecordingRepository() *RecordingRepository {
	return &RecordingRepository{}
}

func (r *RecordingRepository) Create(recording *models.Recording) error {
	return database.DB.Create(recording).Error
}

func (r *RecordingRepository) FindByID(id uuid.UUID) (*models.Recording, error) {
	var recording models.Recording
	err := database.DB.Preload("User").First(&recording, "id = ?", id).Error
	return &recording, err
}

func (r *RecordingRepository) FindByUserID(userID uuid.UUID, limit, offset int) ([]models.Recording, error) {
	var recordings []models.Recording
	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&recordings).Error
	return recordings, err
}

func (r *RecordingRepository) FindByGoogleDriveID(driveID string) (*models.Recording, error) {
	var recording models.Recording
	err := database.DB.Where("google_drive_id = ?", driveID).First(&recording).Error
	if err != nil {
		return nil, err
	}
	return &recording, nil
}

func (r *RecordingRepository) Update(recording *models.Recording) error {
	return database.DB.Save(recording).Error
}

func (r *RecordingRepository) Delete(id uuid.UUID) error {
	return database.DB.Delete(&models.Recording{}, "id = ?", id).Error
}
