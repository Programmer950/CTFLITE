package services

import (
	"Backend/internal/database"
	"database/sql"
)

func CreateUser(username, passwordHash string) error {
	query := `INSERT INTO users (username, password_hash) VALUES ($1, $2)`
	_, err := database.DB.Exec(query, username, passwordHash)
	return err
}

func GetUserByUsername(username string) (int, string, error) {
	var id int
	var hash string

	query := `SELECT id, password_hash FROM users WHERE username=$1`
	err := database.DB.QueryRow(query, username).Scan(&id, &hash)

	if err == sql.ErrNoRows {
		return 0, "", err
	}

	return id, hash, err
}
