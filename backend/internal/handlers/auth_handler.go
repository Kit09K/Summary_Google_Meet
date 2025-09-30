package handler

import (
	"net/http"
	
	"backend/internal/service"
	"backend/internal/utils"
	
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// GoogleLogin initiates Google OAuth flow
func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	url := h.authService.GetGoogleLoginURL()
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GoogleCallback handles Google OAuth callback
func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Authorization code not provided")
		return
	}
	
	// Exchange code for tokens and create/update user
	result, err := h.authService.HandleGoogleCallback(code)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	session := sessions.Default(c)
	session.Set("user_id", result.UserID)   // เก็บ user id
	session.Set("email", result.Email)      // เก็บ email
	session.Save()

// redirect กลับไปหน้า frontend โดยไม่ต้องส่ง token
frontendURL := "http://localhost:3000/dashboard"
c.Redirect(http.StatusTemporaryRedirect, frontendURL)
}

// RefreshToken generates new access token from refresh token
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Refresh token is required")
		return
	}
	
	result, err := h.authService.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Token refreshed successfully", result)
}

// Logout invalidates user session
func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	
	err := h.authService.Logout(userID.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	utils.SuccessResponse(c, http.StatusOK, "Logged out successfully", nil)
}