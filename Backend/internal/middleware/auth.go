package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func getSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		var tokenString string

		// 🔵 1. Try Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 {
				tokenString = parts[1]
			}
		}

		// 🟡 2. Fallback for SSE → query param
		if tokenString == "" {
			tokenString = c.Query("token")
		}

		// 🔴 3. No token at all
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			c.Abort()
			return
		}

		// 🔐 4. Parse JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return getSecret(), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// 🧠 5. Extract claims safely
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid claims"})
			c.Abort()
			return
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id"})
			c.Abort()
			return
		}

		isAdmin, _ := claims["is_admin"].(bool)

		c.Set("user_id", int(userIDFloat))
		c.Set("is_admin", isAdmin)

		c.Next()
	}
}
