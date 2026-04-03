package middleware

import (
	"Backend/internal/cache"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func SubmissionRateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {

		userID := c.GetInt("user_id")
		key := fmt.Sprintf("cooldown:%d", userID)

		exists, _ := cache.RDB.Exists(cache.Ctx, key).Result()

		if exists == 1 {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "slow down",
			})
			c.Abort()
			return
		}

		// 2 sec cooldown
		cache.RDB.Set(cache.Ctx, key, 1, 2*time.Second)

		c.Next()
	}
}
