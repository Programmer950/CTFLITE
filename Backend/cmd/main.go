package main

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/handlers"
	"Backend/internal/middleware"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// ✅ Load .env (DO NOT panic in Docker)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}

	// ✅ Connect services
	database.ConnectDB()
	cache.ConnectRedis()

	r := gin.Default()

	// ✅ CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ✅ Handle preflight requests
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(200)
	})

	// 🔓 Public routes
	r.POST("/api/register", handlers.Register)
	r.POST("/api/login", handlers.Login)

	// 🔐 Protected routes
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	api.POST("/submit",
		middleware.SubmissionRateLimit(),
		handlers.Submit,
	)

	api.GET("/scoreboard", handlers.GetScoreboard)
	api.GET("/challenges", handlers.GetChallenges)
	api.GET("/teams/me", handlers.GetMyTeam)

	api.GET("/me", func(c *gin.Context) {
		userID, _ := c.Get("user_id")
		role, _ := c.Get("is_admin")
		c.JSON(200, gin.H{
			"user_id": userID,
			"role":    role,
		})
	})

	// 👥 Team routes (only in team mode)
	team := api.Group("/teams")
	team.Use(middleware.TeamModeOnly())

	team.POST("", handlers.CreateTeam)
	team.POST("/join", handlers.JoinTeam)
	team.POST("/leave", handlers.LeaveTeam)
	team.DELETE("/:id", handlers.DeleteTeam)

	// 👑 Admin routes
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())

	admin.POST("/challenges", handlers.CreateChallenge)
	admin.GET("/challenges", handlers.GetAllChallenges)
	admin.PUT("/challenges/:id", handlers.UpdateChallenge)
	admin.DELETE("/challenges/:id", handlers.DeleteChallenge)
	admin.DELETE("/submissions", handlers.ResetSubmissions)
	admin.POST("/reset-leaderboard", handlers.ResetLeaderboard)
	admin.POST("/rebuild-leaderboard", handlers.RebuildLeaderboardHandler)

	// 🚀 Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed:", err)
	}
}
