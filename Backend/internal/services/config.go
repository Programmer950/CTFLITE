package services

import (
	"Backend/internal/database"
	"strconv"
)

func GetMode() (string, error) {
	var mode string

	err := database.DB.QueryRow(
		`SELECT value FROM config WHERE key='mode'`,
	).Scan(&mode)

	return mode, err
}

func GetIntConfig(key string) (int, error) {
	var val string

	err := database.DB.QueryRow(
		`SELECT value FROM config WHERE key=$1`,
		key,
	).Scan(&val)

	if err != nil {
		return 0, err
	}

	return strconv.Atoi(val)
}
