package service

import (
	"errors"
	
	"backend/internal/models"
	"backend/internal/repository"
	
	"github.com/google/uuid"
)

type RecordingService struct {
	recordingRepo *repository.RecordingRepository
}

func NewRecordingService(recordingRepo *repository.RecordingRepository) *RecordingService {
	return &RecordingService{
		recordingRepo: recordingRepo,
	}
}

func (s *RecordingService) GetRecordingsByUserID(userID uuid.UUID, limit, offset int) ([]models.Recording, error) {
	return s.recordingRepo.FindByUserID(userID, limit, offset)
}

func (s *RecordingService) GetRecordingByID(id, userID uuid.UUID) (*models.Recording, error) {
	recording, err := s.recordingRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	// Verify ownership
	if recording.UserID != userID {
		return nil, errors.New("unauthorized access to recording")
	}
	
	return recording, nil
}

func (s *RecordingService) SyncRecordingsFromDrive(userID uuid.UUID) (int, error) {
	// TODO: Implement Google Drive API integration
	// 1. Get user's refresh token
	// 2. Use Google Drive API to list video files
	// 3. Create/update recordings in database
	// 4. Return count of synced recordings
	
	return 0, errors.New("sync from drive not implemented yet")
}

func (s *RecordingService) DeleteRecording(id, userID uuid.UUID) error {
	recording, err := s.recordingRepo.FindByID(id)
	if err != nil {
		return err
	}
	
	// Verify ownership
	if recording.UserID != userID {
		return errors.New("unauthorized access to recording")
	}
	
	return s.recordingRepo.Delete(id)
}