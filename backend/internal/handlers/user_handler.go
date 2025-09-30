package handler

import (
	"net/http"
	
	"backend/internal/service"
	"backend/internal/utils"
	
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetCurrentUser returns the authenticated user's information
func (h *UserHandler) GetCurrentUser(c *gin.Context) {
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
	
	user, err := h.userService.GetUserByID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", user)
}

// UpdateUser updates user profile
func (h *UserHandler) UpdateUser(c *gin.Context) {
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
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}
	
	user, err := h.userService.UpdateUser(userID, req.Name, req.Avatar)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "User updated successfully", user)
}

// DeleteUser deletes user account
func (h *UserHandler) DeleteUser(c *gin.Context) {
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
	
	err = h.userService.DeleteUser(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
}