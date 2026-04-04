package services

import (
	"Backend/internal/database"
)

func CreateUser(username, passwordHash string) error {
	query := `INSERT INTO users (username, password_hash) VALUES ($1, $2)`
	_, err := database.DB.Exec(query, username, passwordHash)
	return err
}

func GetUserByUsername(username string) (int, string, bool, error) {
	var id int
	var hash string
	var isAdmin bool

	query := `SELECT id, password_hash, is_admin FROM users WHERE username=$1`

	err := database.DB.QueryRow(query, username).Scan(&id, &hash, &isAdmin)
	if err != nil {
		return 0, "", false, err
	}

	return id, hash, isAdmin, nil
}
