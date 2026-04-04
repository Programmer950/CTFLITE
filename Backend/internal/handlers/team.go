package handlers

import (
	"Backend/internal/database"
	"Backend/internal/services"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreateTeamRequest struct {
	Name string `json:"name"`
}

func CreateTeam(c *gin.Context) {
	var req CreateTeamRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	// 🔴 Validate name
	if strings.TrimSpace(req.Name) == "" {
		c.JSON(400, gin.H{"error": "team name required"})
		return
	}

	userID := c.GetInt("user_id")

	// 🔴 Check if already in team
	var exists bool
	err := database.DB.QueryRow(
		`SELECT EXISTS(
			SELECT 1 FROM team_members WHERE user_id=$1
		)`,
		userID,
	).Scan(&exists)

	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}

	if exists {
		c.JSON(400, gin.H{"error": "already in a team"})
		return
	}

	// 🔴 Use transaction (VERY IMPORTANT)
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}
	defer tx.Rollback()

	// 🔴 Create team
	var teamID int
	err = tx.QueryRow(
		`INSERT INTO teams (name) VALUES ($1) RETURNING id`,
		req.Name,
	).Scan(&teamID)

	if err != nil {
		c.JSON(500, gin.H{"error": "team creation failed"})
		return
	}

	// 🔴 Add creator as owner
	_, err = tx.Exec(
		`INSERT INTO team_members (user_id, team_id, role)
		 VALUES ($1, $2, 'owner')`,
		userID, teamID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to join team"})
		return
	}

	// 🔴 Commit transaction
	if err := tx.Commit(); err != nil {
		c.JSON(500, gin.H{"error": "transaction failed"})
		return
	}

	c.JSON(200, gin.H{
		"message": "team created",
		"team_id": teamID,
	})
}

type JoinTeamRequest struct {
	TeamID int `json:"team_id"`
}

func JoinTeam(c *gin.Context) {
	var req JoinTeamRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	userID := c.GetInt("user_id")

	// 🔴 1. Check if user already in a team
	var exists bool
	err := database.DB.QueryRow(
		`SELECT EXISTS(
			SELECT 1 FROM team_members WHERE user_id=$1
		)`,
		userID,
	).Scan(&exists)

	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}

	if exists {
		c.JSON(400, gin.H{"error": "already in a team"})
		return
	}

	// 🔴 2. Check team size limit
	limit, err := services.GetIntConfig("team_size_limit")
	if err != nil {
		c.JSON(500, gin.H{"error": "config error"})
		return
	}

	var count int
	err = database.DB.QueryRow(
		`SELECT COUNT(*) FROM team_members WHERE team_id=$1`,
		req.TeamID,
	).Scan(&count)

	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}

	if count >= limit {
		c.JSON(400, gin.H{"error": "team is full"})
		return
	}

	// 🔴 3. Join team
	_, err = database.DB.Exec(
		`INSERT INTO team_members (user_id, team_id)
		 VALUES ($1, $2)`,
		userID, req.TeamID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to join team"})
		return
	}

	c.JSON(200, gin.H{"message": "joined team"})
}

func LeaveTeam(c *gin.Context) {

	userID := c.GetInt("user_id")

	_, err := database.DB.Exec(
		`DELETE FROM team_members WHERE user_id=$1`,
		userID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to leave team"})
		return
	}

	c.JSON(200, gin.H{"message": "left team"})
}

func DeleteTeam(c *gin.Context) {

	idParam := c.Param("id")
	teamID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid team id"})
		return
	}

	userID := c.GetInt("user_id")

	// check if user is owner
	var role string
	err = database.DB.QueryRow(
		`SELECT role FROM team_members WHERE user_id=$1 AND team_id=$2`,
		userID, teamID,
	).Scan(&role)

	if err != nil || role != "owner" {
		c.JSON(403, gin.H{"error": "only owner can delete team"})
		return
	}

	_, err = database.DB.Exec(`DELETE FROM teams WHERE id=$1`, teamID)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to delete team"})
		return
	}

	c.JSON(200, gin.H{"message": "team deleted"})
}

func GetMyTeam(c *gin.Context) {

	userID := c.GetInt("user_id")

	var teamID int
	var teamName string

	// 🔍 Find team of user
	err := database.DB.QueryRow(`
		SELECT t.id, t.name
		FROM teams t
		JOIN team_members tm ON tm.team_id = t.id
		WHERE tm.user_id=$1
	`, userID).Scan(&teamID, &teamName)

	if err != nil {
		c.JSON(404, gin.H{"error": "not in a team"})
		return
	}

	// 🔍 Get members
	rows, err := database.DB.Query(`
		SELECT u.id, u.username, tm.role
		FROM team_members tm
		JOIN users u ON u.id = tm.user_id
		WHERE tm.team_id=$1
	`, teamID)

	if err != nil {
		c.JSON(500, gin.H{"error": "db error"})
		return
	}
	defer rows.Close()

	type Member struct {
		ID       int    `json:"id"`
		Username string `json:"username"`
		Role     string `json:"role"`
	}

	members := []Member{}

	for rows.Next() {
		var m Member
		rows.Scan(&m.ID, &m.Username, &m.Role)
		members = append(members, m)
	}

	c.JSON(200, gin.H{
		"team_id":   teamID,
		"team_name": teamName,
		"members":   members,
	})
}
