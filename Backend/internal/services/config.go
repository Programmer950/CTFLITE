package services

import (
	"Backend/internal/database"
	"log"
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
	var value string

	err := database.DB.QueryRow(
		`SELECT value FROM config WHERE key=$1`,
		key,
	).Scan(&value)

	if err != nil {
		log.Println("CONFIG FETCH ERROR:", err)
		return 0, err
	}

	intVal, err := strconv.Atoi(value)
	if err != nil {
		log.Println("CONFIG PARSE ERROR:", err)
		return 0, err
	}

	return intVal, nil
}
