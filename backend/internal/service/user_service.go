package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	
	"github.com/google/uuid"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	return s.userRepo.FindByID(id)
}

func (s *UserService) UpdateUser(id uuid.UUID, name, avatar string) (*models.User, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	
	if name != "" {
		user.Name = name
	}
	if avatar != "" {
		user.Avatar = avatar
	}
	
	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}
	
	return user, nil
}

func (s *UserService) DeleteUser(id uuid.UUID) error {
	return s.userRepo.Delete(id)
}