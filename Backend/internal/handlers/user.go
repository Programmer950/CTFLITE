package handlers

import (
	"Backend/internal/database"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ================= GET USERS =================

func GetUsers(c *gin.Context) {

	rows, err := database.DB.Query(`
		SELECT id, username, email, is_admin
		FROM users
		ORDER BY id ASC
	`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []gin.H

	for rows.Next() {
		var id int
		var username, email string
		var isAdmin bool

		err := rows.Scan(&id, &username, &email, &isAdmin)
		if err != nil {
			continue
		}

		role := "user"
		if isAdmin {
			role = "admin"
		}

		users = append(users, gin.H{
			"id":       id,
			"username": username,
			"email":    email,
			"role":     role,
			"hidden":   false, // optional later
		})
	}

	c.JSON(http.StatusOK, users)
}

// ================= CREATE USER =================

type CreateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateUser(c *gin.Context) {

	var req CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	if req.Username == "" || req.Email == "" || req.Password == "" {
		c.JSON(400, gin.H{"error": "missing fields"})
		return
	}

	// ⚠️ hash password
	hashed := req.Password // replace with bcrypt if you want later

	var id int
	err := database.DB.QueryRow(`
		INSERT INTO users (username, email, password_hash, is_admin)
		VALUES ($1, $2, $3, false)
		RETURNING id
	`, req.Username, req.Email, hashed).Scan(&id)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(200, gin.H{
		"id":       id,
		"username": req.Username,
		"email":    req.Email,
		"role":     "user",
		"hidden":   false,
	})
}

// ================= DELETE USER =================

func DeleteUser(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	_, err = database.DB.Exec(`DELETE FROM users WHERE id=$1`, id)
	if err != nil {
		c.JSON(500, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(200, gin.H{"message": "user deleted"})
}
