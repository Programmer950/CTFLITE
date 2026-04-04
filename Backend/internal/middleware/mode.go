package middleware

import (
	"Backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TeamModeOnly() gin.HandlerFunc {
	return func(c *gin.Context) {

		mode, err := services.GetMode()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "config error"})
			c.Abort()
			return
		}

		if mode != "team" {
			c.JSON(http.StatusForbidden, gin.H{"error": "team mode is disabled"})
			c.Abort()
			return
		}

		c.Next()
	}
}
