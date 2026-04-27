package handlers

import (
	"Backend/internal/notifications"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NotificationStream(c *gin.Context) {

	// 🔐 reuse your auth middleware → user already validated

	client := make(chan string)

	notifications.Hub.AddClient(client)
	defer notifications.Hub.RemoveClient(client)

	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")

	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(500, gin.H{"error": "stream not supported"})
		return
	}

	ctx := c.Request.Context()

	for {
		select {
		case msg := <-client:
			_, err := c.Writer.Write([]byte("data: " + msg + "\n\n"))
			if err != nil {
				return
			}
			flusher.Flush()

		case <-ctx.Done():
			return
		}
	}
}
