package handlers

import (
	"Backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetChallenges(c *gin.Context) {

	userID := c.GetInt("user_id")

	participantID, err := services.GetOrCreateParticipant(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "participant error"})
		return
	}

	data, err := services.GetChallenges(participantID)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch challenges"})
		return
	}

	c.JSON(200, data)
}
