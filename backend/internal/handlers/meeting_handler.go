package handler

import (
	"net/http"
	"strconv"
	
	"backend/internal/service"
	"backend/internal/utils"
	
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MeetingHandler struct {
	meetingService *service.MeetingService
}

func NewMeetingHandler(meetingService *service.MeetingService) *MeetingHandler {
	return &MeetingHandler{
		meetingService: meetingService,
	}
}

// GetMeetings returns list of meetings for authenticated user
func (h *MeetingHandler) GetMeetings(c *gin.Context) {
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
	
	// Pagination parameters
	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")
	
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	
	meetings, err := h.meetingService.GetMeetingsByUserID(userID, limit, offset)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Meetings retrieved successfully", gin.H{
		"meetings": meetings,
		"limit":    limit,
		"offset":   offset,
		"total":    len(meetings),
	})
}

// GetUpcomingMeetings returns upcoming meetings
func (h *MeetingHandler) GetUpcomingMeetings(c *gin.Context) {
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
	
	limitStr := c.DefaultQuery("limit", "10")
	limit, _ := strconv.Atoi(limitStr)
	
	meetings, err := h.meetingService.GetUpcomingMeetings(userID, limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Upcoming meetings retrieved successfully", gin.H{
		"meetings": meetings,
		"count":    len(meetings),
	})
}

// SyncFromCalendar syncs meetings from Google Calendar
func (h *MeetingHandler) SyncFromCalendar(c *gin.Context) {
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
	
	count, err := h.meetingService.SyncMeetingsFromCalendar(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Meetings synced successfully", gin.H{
		"synced_count": count,
	})
}

// GetMeeting returns a specific meeting by ID
func (h *MeetingHandler) GetMeeting(c *gin.Context) {
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
	
	meetingID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid meeting ID")
		return
	}
	
	meeting, err := h.meetingService.GetMeetingByID(meetingID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Meeting retrieved successfully", meeting)
}