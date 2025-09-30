package service

import (
	"errors"
	
	"backend/internal/models"
	"backend/internal/repository"
	
	"github.com/google/uuid"
)

type MeetingService struct {
	meetingRepo *repository.MeetingRepository
}

func NewMeetingService(meetingRepo *repository.MeetingRepository) *MeetingService {
	return &MeetingService{
		meetingRepo: meetingRepo,
	}
}

func (s *MeetingService) GetMeetingsByUserID(userID uuid.UUID, limit, offset int) ([]models.Meeting, error) {
	return s.meetingRepo.FindByUserID(userID, limit, offset)
}

func (s *MeetingService) GetUpcomingMeetings(userID uuid.UUID, limit int) ([]models.Meeting, error) {
	return s.meetingRepo.FindUpcomingByUserID(userID, limit)
}

func (s *MeetingService) GetMeetingByID(id, userID uuid.UUID) (*models.Meeting, error) {
	meeting, err := s.meetingRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	// Verify ownership
	if meeting.UserID != userID {
		return nil, errors.New("unauthorized access to meeting")
	}
	
	return meeting, nil
}

func (s *MeetingService) SyncMeetingsFromCalendar(userID uuid.UUID) (int, error) {
	// TODO: Implement Google Calendar API integration
	// 1. Get user's refresh token
	// 2. Use Google Calendar API to list events
	// 3. Create/update meetings in database
	// 4. Return count of synced meetings
	
	return 0, errors.New("sync from calendar not implemented yet")
}