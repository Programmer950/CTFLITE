package main

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/handlers"
	"Backend/internal/middleware"
	"fmt"
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
	r.GET("/api/config", handlers.GetConfig)

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
	api.GET("/stats", handlers.GetStats)
	api.GET("/categories", handlers.GetCategories)
	api.GET("/me", func(c *gin.Context) {
		userID := c.GetInt("user_id")

		// 🟢 Get username + admin flag
		var username string
		var isAdmin bool

		err := database.DB.QueryRow(
			`SELECT username, is_admin FROM users WHERE id=$1`,
			userID,
		).Scan(&username, &isAdmin)

		if err != nil {
			c.JSON(500, gin.H{"error": "failed to fetch user"})
			return
		}

		// 🟢 Get participant ID
		var participantID int
		err = database.DB.QueryRow(
			`SELECT id FROM participants WHERE user_id=$1`,
			userID,
		).Scan(&participantID)

		if err != nil {
			// user has not participated yet
			c.JSON(200, gin.H{
				"username":     username,
				"is_admin":     isAdmin,
				"score":        0,
				"rank":         0,
				"solved_count": 0,
			})
			return
		}

		// 🟢 Get score from Redis leaderboard
		score, _ := cache.RDB.ZScore(cache.Ctx, "leaderboard", fmt.Sprint(participantID)).Result()

		// 🟢 Get rank (Redis is 0-based)
		rank, _ := cache.RDB.ZRevRank(cache.Ctx, "leaderboard", fmt.Sprint(participantID)).Result()

		// 🟢 Get solved count
		var solvedCount int
		err = database.DB.QueryRow(
			`SELECT COUNT(*) FROM submissions WHERE participant_id=$1 AND is_correct=true`,
			participantID,
		).Scan(&solvedCount)

		if err != nil {
			solvedCount = 0
		}

		c.JSON(200, gin.H{
			"username":     username,
			"is_admin":     isAdmin,
			"score":        int(score),
			"rank":         int(rank) + 1, // convert to 1-based
			"solved_count": solvedCount,
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
	admin.POST("/config", handlers.SaveConfig)

	// 🚀 Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed:", err)
	}
}
