package handlers

import (
	"Backend/internal/services"
	//"net/http"

	"github.com/gin-gonic/gin"
)

func GetScoreboard(c *gin.Context) {
	data, err := services.GetScoreboard()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch scoreboard"})
		return
	}

	c.JSON(200, data)
}
