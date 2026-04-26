package handlers

import (
	"Backend/internal/database"

	"github.com/gin-gonic/gin"
)

func GetStats(c *gin.Context) {

	var totalChallenges int
	var totalSolves int
	var totalPlayers int

	// total challenges
	err := database.DB.QueryRow(
		`SELECT COUNT(*) FROM challenges`,
	).Scan(&totalChallenges)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch challenges count"})
		return
	}

	// total solves (only correct ones)
	err = database.DB.QueryRow(
		`SELECT COUNT(*) FROM submissions WHERE is_correct = true`,
	).Scan(&totalSolves)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch solves count"})
		return
	}
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&totalPlayers)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch players count"})
		return
	}

	c.JSON(200, gin.H{
		"total_challenges": totalChallenges,
		"total_solves":     totalSolves,
		"total_players":    totalPlayers,
	})
}
func GetCategories(c *gin.Context) {

	rows, err := database.DB.Query(
		`SELECT DISTINCT category FROM challenges`,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch categories"})
		return
	}
	defer rows.Close()

	categories := make([]string, 0)

	for rows.Next() {
		var category string
		if err := rows.Scan(&category); err != nil {
			continue
		}
		categories = append(categories, category)
	}

	c.JSON(200, categories)
}
