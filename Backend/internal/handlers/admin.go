package handlers

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/services"
	"strings"

	"github.com/gin-gonic/gin"
)

func normalize(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}

func ResetSubmissions(c *gin.Context) {

	_, err := database.DB.Exec(`DELETE FROM submissions`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to reset submissions"})
		return
	}

	c.JSON(200, gin.H{"message": "submissions cleared"})
}

func ResetLeaderboard(c *gin.Context) {

	err := cache.RDB.Del(cache.Ctx, "leaderboard").Err()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to reset leaderboard"})
		return
	}

	c.JSON(200, gin.H{"message": "leaderboard cleared"})
}

func RebuildLeaderboardHandler(c *gin.Context) {

	err := services.RebuildLeaderboard()
	if err != nil {
		c.JSON(500, gin.H{"error": "rebuild failed"})
		return
	}

	c.JSON(200, gin.H{"message": "leaderboard rebuilt"})
}
