package service

import (
	"context"
	"errors"
	"fmt"
	
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repository"
	// "backend/internal/utils"
	
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	// "google.golang.org/api/option"
)

type AuthService struct {
	config     *config.Config
	userRepo   *repository.UserRepository
	oauthConfig *oauth2.Config
}

func NewAuthService(cfg *config.Config, userRepo *repository.UserRepository) *AuthService {
	oauthConfig := &oauth2.Config{
		ClientID:     cfg.Google.ClientID,
		ClientSecret: cfg.Google.ClientSecret,
		RedirectURL:  cfg.Google.RedirectURL,
		Scopes: []string{
			"openid",
			"email",
			"profile",
			"https://www.googleapis.com/auth/drive.readonly",
			"https://www.googleapis.com/auth/calendar.readonly",
		},
		Endpoint: google.Endpoint,
	}
	
	return &AuthService{
		config:      cfg,
		userRepo:    userRepo,
		oauthConfig: oauthConfig,
	}
}

// func (s *AuthService) GetGoogleLoginURL() string {
// 	// Generate random state for CSRF protection
// 	state := utils.GenerateRandomString(32)
// 	return s.oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
// }

type AuthResult struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token,omitempty"`
	ExpiresIn    int64        `json:"expires_in"`
	User         *models.User `json:"user"`
}

func (s *AuthService) HandleGoogleCallback(code string) (*AuthResult, error) {
	ctx := context.Background()
	
	// Exchange code for token
	token, err := s.oauthConfig.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}
	
	// Get user info from Google
	// oauth2Service, err := oauth2.NewService(ctx, option.WithTokenSource(s.oauthConfig.TokenSource(ctx, token)))
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to create oauth2 service: %w", err)
	// }
	
	// userInfo, err := oauth2Service.Userinfo.Get().Do()
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to get user info: %w", err)
	// }
	
	// Find or create user
	// user, err := s.userRepo.FindByGoogleID(userInfo.Id)
	// if err != nil {
	// 	return nil, err
	// }
	
	
	expiresAt := token.Expiry
	
	if user == nil {
		// Create new user
		user = &models.User{
			GoogleID:       userInfo.Id,
			Email:          userInfo.Email,
			Name:           userInfo.Name,
			Avatar:         userInfo.Picture,
			TokenExpiresAt: &expiresAt,
		}
		
		if err := s.userRepo.Create(user); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	} else {
		// Update existing user
		user.Name = userInfo.Name
		user.Avatar = userInfo.Picture
		// if encryptedRefreshToken != "" {
		// 	user.RefreshToken = encryptedRefreshToken
		// }
		user.TokenExpiresAt = &expiresAt
		
		if err := s.userRepo.Update(user); err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
	}
	
	// Generate JWT
	
	return &AuthResult{
		AccessToken:  jwtToken,
		RefreshToken: token.RefreshToken,
		User:         user,
	}, nil
}

func (s *AuthService) RefreshAccessToken(refreshToken string) (*AuthResult, error) {
	// This would typically validate the refresh token and generate new access token
	// For now, just return error
	return nil, errors.New("refresh token functionality not implemented yet")
}

func (s *AuthService) Logout(userID string) error {
	// Optionally clear refresh token from database
	return nil
}