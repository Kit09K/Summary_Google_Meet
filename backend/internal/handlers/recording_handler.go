package handler

import (
	"net/http"
	"strconv"
	
	"backend/internal/service"
	"backend/internal/utils"
	
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type RecordingHandler struct {
	recordingService *service.RecordingService
}

func NewRecordingHandler(recordingService *service.RecordingService) *RecordingHandler {
	return &RecordingHandler{
		recordingService: recordingService,
	}
}

// GetRecordings returns list of recordings for authenticated user
func (h *RecordingHandler) GetRecordings(c *gin.Context) {
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
	
	recordings, err := h.recordingService.GetRecordingsByUserID(userID, limit, offset)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Recordings retrieved successfully", gin.H{
		"recordings": recordings,
		"limit":      limit,
		"offset":     offset,
		"total":      len(recordings),
	})
}

// GetRecording returns a specific recording by ID
func (h *RecordingHandler) GetRecording(c *gin.Context) {
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
	
	recordingID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid recording ID")
		return
	}
	
	recording, err := h.recordingService.GetRecordingByID(recordingID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Recording retrieved successfully", recording)
}

// SyncFromDrive syncs recordings from Google Drive
func (h *RecordingHandler) SyncFromDrive(c *gin.Context) {
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
	
	count, err := h.recordingService.SyncRecordingsFromDrive(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Recordings synced successfully", gin.H{
		"synced_count": count,
	})
}

// DeleteRecording deletes a recording
func (h *RecordingHandler) DeleteRecording(c *gin.Context) {
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
	
	recordingID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid recording ID")
		return
	}
	
	err = h.recordingService.DeleteRecording(recordingID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Recording deleted successfully", nil)
}