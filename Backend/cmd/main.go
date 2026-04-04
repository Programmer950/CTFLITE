package main

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/handlers"
	"Backend/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	database.ConnectDB()
	cache.ConnectRedis()

	r := gin.Default()

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	api := r.Group("/api")

	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())

	team := api.Group("/teams")
	team.Use(middleware.TeamModeOnly())

	api.Use(middleware.AuthMiddleware())
	api.POST("/submit", middleware.AuthMiddleware(),
		middleware.SubmissionRateLimit(),
		handlers.Submit)
	api.GET("/scoreboard", handlers.GetScoreboard)
	api.GET("/challenges", handlers.GetChallenges)
	api.GET("/teams/me", handlers.GetMyTeam)
	api.GET("/me", func(c *gin.Context) {
		userID, _ := c.Get("user_id")

		c.JSON(200, gin.H{
			"user_id": userID,
		})
	})

	admin.POST("/challenges", handlers.CreateChallenge)
	admin.GET("/challenges", handlers.GetAllChallenges)
	admin.PUT("/challenges/:id", handlers.UpdateChallenge)
	admin.DELETE("/challenges/:id", handlers.DeleteChallenge)
	admin.DELETE("/submissions", handlers.ResetSubmissions)
	admin.POST("/reset-leaderboard", handlers.ResetLeaderboard)
	admin.POST("/rebuild-leaderboard", handlers.RebuildLeaderboardHandler)

	team.POST("", handlers.CreateTeam)
	team.POST("/join", handlers.JoinTeam)
	team.POST("/leave", handlers.LeaveTeam)
	team.DELETE("/:id", handlers.DeleteTeam)

	r.Run(":8080")
}
