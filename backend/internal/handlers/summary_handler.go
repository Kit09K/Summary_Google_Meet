package handler

import (
	"net/http"
	"strconv"
	
	"backend/internal/models"
	"backend/internal/service"
	"backend/internal/utils"
	
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SummaryHandler struct {
	summaryService *service.SummaryService
}

func NewSummaryHandler(summaryService *service.SummaryService) *SummaryHandler {
	return &SummaryHandler{
		summaryService: summaryService,
	}
}

// GetSummaries returns list of summaries for authenticated user
func (h *SummaryHandler) GetSummaries(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}
	
	// Pagination and filters
	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")
	status := c.Query("status") // Filter by status
	
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	
	summaries, err := h.summaryService.GetSummariesByUserID(userID, limit, offset, status)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Summaries retrieved successfully", gin.H{
		"summaries": summaries,
		"limit":     limit,
		"offset":    offset,
		"total":     len(summaries),
	})
}

// GetSummary returns a specific summary by ID
func (h *SummaryHandler) GetSummary(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}
	
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	summary, err := h.summaryService.GetSummaryByID(summaryID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Summary retrieved successfully", summary)
}

// CreateSummary creates a new summary from recording
func (h *SummaryHandler) CreateSummary(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}
	
	var req struct {
		RecordingID *string `json:"recording_id"`
		MeetingID   *string `json:"meeting_id"`
		Title       string  `json:"title" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	// Parse optional UUIDs
	var recordingID, meetingID *uuid.UUID
	if req.RecordingID != nil {
		id, err := uuid.Parse(*req.RecordingID)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid recording ID")
			return
		}
		recordingID = &id
	}
	if req.MeetingID != nil {
		id, err := uuid.Parse(*req.MeetingID)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid meeting ID")
			return
		}
		meetingID = &id
	}
	
	summary, err := h.summaryService.CreateSummary(userID, recordingID, meetingID, req.Title)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusCreated, "Summary created successfully", summary)
}

// UpdateSummary updates an existing summary
func (h *SummaryHandler) UpdateSummary(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}
	
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	var req struct {
		Title   *string `json:"title"`
		Summary *string `json:"summary"`
		Content *string `json:"content"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	summary, err := h.summaryService.UpdateSummary(summaryID, userID, req.Title, req.Summary, req.Content)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Summary updated successfully", summary)
}

// DeleteSummary deletes a summary
func (h *SummaryHandler) DeleteSummary(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}
	
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	err = h.summaryService.DeleteSummary(summaryID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Summary deleted successfully", nil)
}

// GetAttendees returns attendees for a summary
func (h *SummaryHandler) GetAttendees(c *gin.Context) {
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	attendees, err := h.summaryService.GetAttendees(summaryID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Attendees retrieved successfully", gin.H{
		"attendees": attendees,
	})
}

// GetActionItems returns action items for a summary
func (h *SummaryHandler) GetActionItems(c *gin.Context) {
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	items, err := h.summaryService.GetActionItems(summaryID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Action items retrieved successfully", gin.H{
		"action_items": items,
	})
}

// CreateActionItem creates a new action item
func (h *SummaryHandler) CreateActionItem(c *gin.Context) {
	summaryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid summary ID")
		return
	}
	
	var req struct {
		Description string                  `json:"description" binding:"required"`
		Assignee    string                  `json:"assignee"`
		DueDate     *string                 `json:"due_date"`
		Priority    models.Priority         `json:"priority"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	item, err := h.summaryService.CreateActionItem(summaryID, req.Description, req.Assignee, req.DueDate, req.Priority)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusCreated, "Action item created successfully", item)
}

// UpdateActionItem updates an action item
func (h *SummaryHandler) UpdateActionItem(c *gin.Context) {
	itemID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid action item ID")
		return
	}
	
	var req struct {
		Description *string                  `json:"description"`
		Assignee    *string                  `json:"assignee"`
		Status      *models.ActionItemStatus `json:"status"`
		Priority    *models.Priority         `json:"priority"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	item, err := h.summaryService.UpdateActionItem(itemID, req.Description, req.Assignee, req.Status, req.Priority)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Action item updated successfully", item)
}