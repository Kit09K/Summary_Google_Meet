package router

import (
	"backend/internal/config"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/service"
	
	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()
	
	// Middleware
	r.Use(middleware.CORS(cfg.CORS.AllowedOrigins))
	r.Use(middleware.Logger())
	
	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"message": "Server is running",
		})
	})
	
	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Initialize repositories
		userRepo := repository.NewUserRepository()
		recordingRepo := repository.NewRecordingRepository()
		meetingRepo := repository.NewMeetingRepository()
		summaryRepo := repository.NewSummaryRepository()
		
		// Initialize services
		authService := service.NewAuthService(cfg, userRepo)
		userService := service.NewUserService(userRepo)
		recordingService := service.NewRecordingService(recordingRepo)
		meetingService := service.NewMeetingService(meetingRepo)
		summaryService := service.NewSummaryService(summaryRepo)
		
		// Initialize handlers
		authHandler := handler.NewAuthHandler(authService)
		userHandler := handler.NewUserHandler(userService)
		recordingHandler := handler.NewRecordingHandler(recordingService)
		meetingHandler := handler.NewMeetingHandler(meetingService)
		summaryHandler := handler.NewSummaryHandler(summaryService)
		
		// Auth routes (public)
		auth := v1.Group("/auth")
		{
			auth.GET("/google", authHandler.GoogleLogin)
			auth.GET("/google/callback", authHandler.GoogleCallback)
			auth.POST("/refresh", authHandler.RefreshToken)
		}
		
		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
		{
			// User routes
			protected.GET("/user/me", userHandler.GetCurrentUser)
			protected.PUT("/user/me", userHandler.UpdateUser)
			
			// Recording routes
			protected.GET("/recordings", recordingHandler.GetRecordings)
			protected.GET("/recordings/:id", recordingHandler.GetRecording)
			protected.POST("/recordings/sync", recordingHandler.SyncFromDrive)
			
			// Meeting routes
			protected.GET("/meetings", meetingHandler.GetMeetings)
			protected.GET("/meetings/upcoming", meetingHandler.GetUpcomingMeetings)
			protected.POST("/meetings/sync", meetingHandler.SyncFromCalendar)
			
			// Summary routes
			protected.GET("/summaries", summaryHandler.GetSummaries)
			protected.GET("/summaries/:id", summaryHandler.GetSummary)
			protected.POST("/summaries", summaryHandler.CreateSummary)
			protected.PUT("/summaries/:id", summaryHandler.UpdateSummary)
			protected.DELETE("/summaries/:id", summaryHandler.DeleteSummary)
			
			// Attendees
			protected.GET("/summaries/:id/attendees", summaryHandler.GetAttendees)
			
			// Action Items
			protected.GET("/summaries/:id/action-items", summaryHandler.GetActionItems)
			protected.POST("/summaries/:id/action-items", summaryHandler.CreateActionItem)
			protected.PUT("/action-items/:id", summaryHandler.UpdateActionItem)
		}
	}
	
	return r
}