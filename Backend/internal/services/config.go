package services

import "Backend/internal/database"

func GetMode() (string, error) {
	var mode string

	err := database.DB.QueryRow(
		`SELECT value FROM config WHERE key='mode'`,
	).Scan(&mode)

	return mode, err
}
