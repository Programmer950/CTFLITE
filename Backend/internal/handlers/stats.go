package handlers

import (
	"Backend/internal/cache"
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

func GetCategoryStats(c *gin.Context) {

	rows, err := database.DB.Query(`
		SELECT category, COUNT(*)
		FROM challenges
		GROUP BY category
	`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}
	defer rows.Close()

	type Item struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}

	var result []Item

	for rows.Next() {
		var name string
		var value int
		rows.Scan(&name, &value)

		result = append(result, Item{name, value})
	}

	c.JSON(200, result)
}

func GetDifficultyStats(c *gin.Context) {

	rows, err := database.DB.Query(`
		SELECT difficulty, COUNT(*)
		FROM challenges
		GROUP BY difficulty
	`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}
	defer rows.Close()

	type Item struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}

	var result []Item

	for rows.Next() {
		var name string
		var value int
		rows.Scan(&name, &value)

		result = append(result, Item{name, value})
	}

	c.JSON(200, result)
}

func GetScoreDistribution(c *gin.Context) {

	scores, err := cache.RDB.ZRangeWithScores(cache.Ctx, "leaderboard", 0, -1).Result()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}

	buckets := map[string]int{
		"0-100":   0,
		"100-300": 0,
		"300-600": 0,
		"600+":    0,
	}

	for _, s := range scores {
		score := int(s.Score)

		switch {
		case score < 100:
			buckets["0-100"]++
		case score < 300:
			buckets["100-300"]++
		case score < 600:
			buckets["300-600"]++
		default:
			buckets["600+"]++
		}
	}

	type Item struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}

	var result []Item
	for k, v := range buckets {
		result = append(result, Item{k, v})
	}

	c.JSON(200, result)
}

func GetProgression(c *gin.Context) {

	rows, err := database.DB.Query(`
		SELECT DATE(created_at), COUNT(*)
		FROM submissions
		WHERE is_correct = true
		GROUP BY DATE(created_at)
		ORDER BY DATE(created_at)
	`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}
	defer rows.Close()

	type Item struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}

	var result []Item

	for rows.Next() {
		var date string
		var count int
		rows.Scan(&date, &count)

		result = append(result, Item{
			Name:  date,
			Value: count,
		})
	}

	c.JSON(200, result)
}
