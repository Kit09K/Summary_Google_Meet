package utils

import (
	"errors"
	"regexp"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func ValidateEmail(email string) error {
	if !emailRegex.MatchString(email) {
		return errors.New("invalid email format")
	}
	return nil
}

func ValidateRequired(value, fieldName string) error {
	if value == "" {
		return errors.New(fieldName + " is required")
	}
	return nil
}