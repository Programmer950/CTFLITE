package handlers

import (
	"Backend/internal/database"
	"Backend/internal/notifications"
	"encoding/json"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateNotification(c *gin.Context) {

	var req struct {
		Title     string `json:"title"`
		Content   string `json:"content"`
		Type      string `json:"type"`
		PlaySound bool   `json:"play_sound"`
		Target    string `json:"target"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	// 🟢 Insert notification
	var notifID int
	err := database.DB.QueryRow(
		`INSERT INTO notifications (title, content, type, play_sound, target)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		req.Title, req.Content, req.Type, req.PlaySound, req.Target,
	).Scan(&notifID)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// 🟢 Assign to users
	rows, err := database.DB.Query(`SELECT id FROM users`)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch users"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var userID int
		rows.Scan(&userID)

		database.DB.Exec(
			`INSERT INTO user_notifications (user_id, notification_id)
			 VALUES ($1, $2)`,
			userID, notifID,
		)
	}

	// 🟢 Broadcast AFTER everything is ready
	notif := map[string]interface{}{
		"id":         notifID,
		"title":      req.Title,
		"content":    req.Content,
		"type":       req.Type,
		"created_at": time.Now(),
	}

	jsonData, _ := json.Marshal(notif)

	notifications.Hub.Broadcast(string(jsonData))

	c.JSON(200, gin.H{"message": "notification created"})
}

func GetNotifications(c *gin.Context) {

	userID := c.GetInt("user_id")

	// 🟢 Parse query params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// 🟢 Query notifications
	rows, err := database.DB.Query(`
		SELECT n.id, n.title, n.content, n.type, un.read, n.created_at
		FROM user_notifications un
		JOIN notifications n ON un.notification_id = n.id
		WHERE un.user_id = $1
		ORDER BY n.created_at DESC
		LIMIT $2 OFFSET $3
	`, userID, limit, offset)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch notifications"})
		return
	}
	defer rows.Close()

	type Notification struct {
		ID        int    `json:"id"`
		Title     string `json:"title"`
		Content   string `json:"content"`
		Type      string `json:"type"`
		Read      bool   `json:"read"`
		CreatedAt string `json:"created_at"`
	}

	notifs := []Notification{}

	for rows.Next() {
		var n Notification
		rows.Scan(&n.ID, &n.Title, &n.Content, &n.Type, &n.Read, &n.CreatedAt)
		notifs = append(notifs, n)
	}

	// 🟢 Total count (for frontend pagination)
	var total int
	err = database.DB.QueryRow(
		`SELECT COUNT(*) FROM user_notifications WHERE user_id=$1`,
		userID,
	).Scan(&total)

	if err != nil {
		total = 0
	}

	c.JSON(200, gin.H{
		"page":          page,
		"limit":         limit,
		"total":         total,
		"notifications": notifs,
	})
}

func MarkNotificationRead(c *gin.Context) {

	userID := c.GetInt("user_id")
	id := c.Param("id")

	_, err := database.DB.Exec(
		`UPDATE user_notifications
		 SET read=true
		 WHERE user_id=$1 AND notification_id=$2`,
		userID, id,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}

	c.JSON(200, gin.H{"message": "marked as read"})
}

func MarkAllNotificationsRead(c *gin.Context) {

	userID := c.GetInt("user_id")

	_, err := database.DB.Exec(
		`UPDATE user_notifications SET read=true WHERE user_id=$1`,
		userID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}

	c.JSON(200, gin.H{"message": "all marked as read"})
}

func DeleteNotification(c *gin.Context) {

	userID := c.GetInt("user_id")
	id := c.Param("id")

	_, err := database.DB.Exec(
		`DELETE FROM user_notifications
		 WHERE user_id=$1 AND notification_id=$2`,
		userID, id,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}

	c.JSON(200, gin.H{"message": "deleted"})
}

func GetAllNotifications(c *gin.Context) {

	rows, err := database.DB.Query(
		`SELECT id, title, content, type, created_at FROM notifications ORDER BY created_at DESC`,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed"})
		return
	}
	defer rows.Close()

	var result []map[string]interface{}

	for rows.Next() {
		var id int
		var title, content, typ, created string

		rows.Scan(&id, &title, &content, &typ, &created)

		result = append(result, gin.H{
			"id":         id,
			"title":      title,
			"content":    content,
			"type":       typ,
			"created_at": created,
		})
	}

	c.JSON(200, result)
}
