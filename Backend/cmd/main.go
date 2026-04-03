package main

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/handlers"
	"Backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()
	cache.ConnectRedis()

	r := gin.Default()

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	api.POST("/submit", handlers.Submit)
	api.GET("/scoreboard", handlers.GetScoreboard)
	api.GET("/challenges", handlers.GetChallenges)
	api.GET("/me", func(c *gin.Context) {
		userID, _ := c.Get("user_id")

		c.JSON(200, gin.H{
			"user_id": userID,
		})
	})

	r.Run(":8080")
}
