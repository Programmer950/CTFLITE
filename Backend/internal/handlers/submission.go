package handlers

import (
	"Backend/internal/services"
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
		c.JSON(500, gin.H{"error": "submission error"})
		return
	}

	// 5. Response
	if result {
		c.JSON(200, gin.H{"result": "correct"})
	} else {
		c.JSON(200, gin.H{"result": "wrong or already solved"})
	}
}
