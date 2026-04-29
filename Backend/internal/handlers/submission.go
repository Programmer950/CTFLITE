package handlers

import (
	"Backend/internal/database"
	"Backend/internal/services"
	"time"

	//"net/http"
	"fmt"

	"github.com/gin-gonic/gin"
)

type SubmitRequest struct {
	ChallengeID int    `json:"challenge_id"`
	Flag        string `json:"flag"`
}

func Submit(c *gin.Context) {

	fmt.Println("Submit handler called")
	var req SubmitRequest

	// 1. Read JSON
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	// 2. Get user from JWT
	userID := c.GetInt("user_id")

	// 3. Convert to participant
	participantID, err := services.GetOrCreateParticipant(userID)
	if err != nil {
		if err.Error() == "user is not in a team" {
			c.JSON(400, gin.H{"error": "you must join a team to submit"})
			return
		}

		c.JSON(500, gin.H{"error": "participant error"})
		return
	}

	// 4. Submit flag
	result, err := services.SubmitFlag(participantID, req.ChallengeID, req.Flag)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// 5. Response
	if result {
		c.JSON(200, gin.H{"result": "correct"})
	} else {
		c.JSON(200, gin.H{"result": "wrong or already solved"})
	}
}

func GetSubmissionStats(c *gin.Context) {

	var correct int
	var incorrect int

	err := database.DB.QueryRow(`
		SELECT 
			COUNT(*) FILTER (WHERE is_correct = true),
			COUNT(*) FILTER (WHERE is_correct = false)
		FROM submissions
	`).Scan(&correct, &incorrect)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch submission stats"})
		return
	}

	c.JSON(200, gin.H{
		"correct":   correct,
		"incorrect": incorrect,
	})
}

func GetAllSubmissions(c *gin.Context) {

	rows, err := database.DB.Query(`
		SELECT 
			s.id,
			u.username,
			ch.title,
			ch.type,
			s.provided_flag,
			s.is_correct,
			s.created_at
		FROM submissions s
		JOIN participants p ON s.participant_id = p.id
		JOIN users u ON p.user_id = u.id
		JOIN challenges ch ON s.challenge_id = ch.id
		ORDER BY s.created_at DESC
	`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch submissions"})
		return
	}
	defer rows.Close()

	type Submission struct {
		ID        int    `json:"id"`
		User      string `json:"user"`
		Challenge string `json:"challenge"`
		Type      string `json:"type"`
		Provided  string `json:"provided"`
		Correct   bool   `json:"correct"`
		Date      string `json:"date"`
	}

	var result []Submission

	for rows.Next() {
		var s Submission
		var createdAt time.Time

		err := rows.Scan(
			&s.ID,
			&s.User,
			&s.Challenge,
			&s.Type,
			&s.Provided,
			&s.Correct,
			&createdAt,
		)
		if err != nil {
			continue
		}

		s.Date = createdAt.Format("2006-01-02")

		result = append(result, s)
	}

	c.JSON(200, result)
}
