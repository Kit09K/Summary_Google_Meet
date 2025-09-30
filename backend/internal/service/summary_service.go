package service

import (
	"errors"
	"time"
	
	"backend/internal/models"
	"backend/internal/repository"
	
	"github.com/google/uuid"
)

type SummaryService struct {
	summaryRepo *repository.SummaryRepository
}

func NewSummaryService(summaryRepo *repository.SummaryRepository) *SummaryService {
	return &SummaryService{
		summaryRepo: summaryRepo,
	}
}

func (s *SummaryService) GetSummariesByUserID(userID uuid.UUID, limit, offset int, status string) ([]models.Summary, error) {
	// TODO: Add status filtering
	return s.summaryRepo.FindByUserID(userID, limit, offset)
}

func (s *SummaryService) GetSummaryByID(id, userID uuid.UUID) (*models.Summary, error) {
	summary, err := s.summaryRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	// Verify ownership
	if summary.UserID != userID {
		return nil, errors.New("unauthorized access to summary")
	}
	
	return summary, nil
}

func (s *SummaryService) CreateSummary(userID uuid.UUID, recordingID, meetingID *uuid.UUID, title string) (*models.Summary, error) {
	summary := &models.Summary{
		UserID:      userID,
		RecordingID: recordingID,
		MeetingID:   meetingID,
		Title:       title,
		Status:      models.StatusPending,
	}
	
	err := s.summaryRepo.Create(summary)
	if err != nil {
		return nil, err
	}
	
	// TODO: Trigger AI processing in background
	// go s.processWithAI(summary.ID)
	
	return summary, nil
}

func (s *SummaryService) UpdateSummary(id, userID uuid.UUID, title, summary, content *string) (*models.Summary, error) {
	sum, err := s.summaryRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	// Verify ownership
	if sum.UserID != userID {
		return nil, errors.New("unauthorized access to summary")
	}
	
	if title != nil {
		sum.Title = *title
	}
	if summary != nil {
		sum.Summary = *summary
	}
	if content != nil {
		sum.Content = *content
	}
	
	err = s.summaryRepo.Update(sum)
	if err != nil {
		return nil, err
	}
	
	return sum, nil
}

func (s *SummaryService) DeleteSummary(id, userID uuid.UUID) error {
	summary, err := s.summaryRepo.FindByID(id)
	if err != nil {
		return err
	}
	
	// Verify ownership
	if summary.UserID != userID {
		return errors.New("unauthorized access to summary")
	}
	
	return s.summaryRepo.Delete(id)
}

func (s *SummaryService) GetAttendees(summaryID uuid.UUID) ([]models.Attendee, error) {
	return s.summaryRepo.FindAttendeesBySummaryID(summaryID)
}

func (s *SummaryService) GetActionItems(summaryID uuid.UUID) ([]models.ActionItem, error) {
	return s.summaryRepo.FindActionItemsBySummaryID(summaryID)
}

func (s *SummaryService) CreateActionItem(summaryID uuid.UUID, description, assignee string, dueDate *string, priority models.Priority) (*models.ActionItem, error) {
	item := &models.ActionItem{
		SummaryID:   summaryID,
		Description: description,
		Assignee:    assignee,
		Status:      models.ActionPending,
		Priority:    priority,
	}
	
	if dueDate != nil {
		parsedDate, err := time.Parse(time.RFC3339, *dueDate)
		if err == nil {
			item.DueDate = &parsedDate
		}
	}
	
	err := s.summaryRepo.CreateActionItem(item)
	if err != nil {
		return nil, err
	}
	
	return item, nil
}

func (s *SummaryService) UpdateActionItem(id uuid.UUID, description, assignee *string, status *models.ActionItemStatus, priority *models.Priority) (*models.ActionItem, error) {
	// TODO: Implement find action item by ID in repository
	// For now, just return error
	return nil, errors.New("update action item not fully implemented yet")
}