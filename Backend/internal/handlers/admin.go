package handlers

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/services"
	"Backend/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateChallengeRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Points      int    `json:"points"`
	Flag        string `json:"flag"`
	Category    string `json:"category"`
	Difficulty  string `json:"difficulty"`
}

func CreateChallenge(c *gin.Context) {
	var req CreateChallengeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	query := `
	INSERT INTO challenges (title, description, points, flag_hash, category, difficulty) VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := database.DB.Exec(query,
		req.Title,
		req.Description,
		req.Points,
		utils.HashFlag(req.Flag),
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create challenge"})
		return
	}

	c.JSON(200, gin.H{"message": "challenge created"})
}

func GetAllChallenges(c *gin.Context) {

	rows, err := database.DB.Query(
		`SELECT id, title, description, points, flag_hash FROM challenges`,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch challenges"})
		return
	}
	defer rows.Close()

	type Challenge struct {
		ID          int    `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Points      int    `json:"points"`
		Flag        string `json:"flag"`
	}

	challenges := make([]Challenge, 0)

	for rows.Next() {
		var ch Challenge
		err := rows.Scan(&ch.ID, &ch.Title, &ch.Description, &ch.Points, &ch.Flag)
		if err != nil {
			continue
		}
		challenges = append(challenges, ch)
	}

	c.JSON(200, challenges)
}

func UpdateChallenge(c *gin.Context) {

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	var req CreateChallengeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	_, err = database.DB.Exec(
		`UPDATE challenges
		 SET title=$1, description=$2, points=$3, flag_hash=$4
		 WHERE id=$5`,
		req.Title, req.Description, req.Points, req.Flag, id,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "update failed"})
		return
	}

	c.JSON(200, gin.H{"message": "challenge updated"})
}

func DeleteChallenge(c *gin.Context) {

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	_, err = database.DB.Exec(`DELETE FROM challenges WHERE id=$1`, id)
	if err != nil {
		c.JSON(500, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(200, gin.H{"message": "challenge deleted"})
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
