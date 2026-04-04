package handlers

import (
	"Backend/internal/database"
	"Backend/internal/services"
	"Backend/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Register(c *gin.Context) {
	var req RegisterRequest

	// 🔴 Validate input first
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if strings.TrimSpace(req.Username) == "" || strings.TrimSpace(req.Password) == "" {
		c.JSON(400, gin.H{"error": "username and password required"})
		return
	}

	// 🔴 Get user limit
	limit, err := services.GetIntConfig("max_users")
	if err != nil {
		c.JSON(500, gin.H{"error": "config error"})
		return
	}

	// 🔴 Count users (with error handling)
	var count int
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&count)
	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}

	if count >= limit {
		c.JSON(400, gin.H{"error": "user limit reached"})
		return
	}

	// 🔴 Hash password
	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	// 🔴 Create user
	err = services.CreateUser(req.Username, hash)
	if err != nil {
		c.JSON(400, gin.H{"error": "username already exists"})
		return
	}

	c.JSON(200, gin.H{"message": "user created"})
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	id, hash, isAdmin, err := services.GetUserByUsername(req.Username)
	if err != nil || !utils.CheckPassword(req.Password, hash) {
		c.JSON(401, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(id, isAdmin)
	if err != nil {
		c.JSON(500, gin.H{"error": "token error"})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}
