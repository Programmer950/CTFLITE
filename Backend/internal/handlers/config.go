package handlers

import (
	"Backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetConfig(c *gin.Context) {
	config, err := services.GetConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}

	c.JSON(http.StatusOK, config)
}

func SaveConfig(c *gin.Context) {
	var config map[string]interface{}

	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid config"})
		return
	}

	err := services.SaveConfig(config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save config"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Config saved"})
}
