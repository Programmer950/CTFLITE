package handlers

import (
	"Backend/internal/database"
	"Backend/internal/models"
	"Backend/internal/services"
	"Backend/internal/utils"
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type CreateChallengeRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Difficulty  string `json:"difficulty"`

	Type string `json:"type"`

	Points int `json:"points"`

	InitialValue int `json:"initialValue"`
	Decay        int `json:"decay"`
	MinValue     int `json:"minValue"`

	Flag          string `json:"flag"`
	FlagType      string `json:"flagType"`
	CaseSensitive bool   `json:"caseSensitive"`

	State       string   `json:"state"`
	MaxAttempts int      `json:"maxAttempts"`
	Author      string   `json:"author"`
	Tags        []string `json:"tags"`
	Hints       []string `json:"hints"`
}

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

func CreateChallenge(c *gin.Context) {

	// 🔥 READ FORM DATA (multipart)
	title := c.PostForm("title")
	description := c.PostForm("description")
	category := normalize(c.PostForm("category"))
	difficulty := normalize(c.PostForm("difficulty"))
	ctype := normalize(c.PostForm("type"))

	flag := c.PostForm("flag")
	flagType := normalize(c.PostForm("flagType"))

	state := normalize(c.PostForm("state"))
	author := c.PostForm("author")

	points, _ := strconv.Atoi(c.PostForm("points"))
	initialValue, _ := strconv.Atoi(c.PostForm("initialValue"))
	decay, _ := strconv.Atoi(c.PostForm("decay"))
	minValue, _ := strconv.Atoi(c.PostForm("minValue"))
	maxAttempts, _ := strconv.Atoi(c.PostForm("maxAttempts"))

	caseSensitive := c.PostForm("caseSensitive") == "true"

	tags := []string{}
	hints := []string{}

	// 🔥 FILE HANDLING
	file, err := c.FormFile("file")
	filePath := ""

	fmt.Println("FILE DEBUG:", file, err)

	if err == nil && file != nil {
		filePath = "uploads/" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename

		err = c.SaveUploadedFile(file, filePath)
		if err != nil {
			c.JSON(500, gin.H{"error": "file upload failed"})
			return
		}
	}

	// 🔥 DEFAULTS
	if difficulty == "" {
		difficulty = "easy"
	}
	if ctype == "" {
		ctype = "standard"
	}
	if state == "" {
		state = "visible"
	}
	if flagType == "" {
		flagType = "static"
	}

	// 🔥 VALIDATION
	if title == "" || description == "" || flag == "" {
		c.JSON(400, gin.H{"error": "missing required fields"})
		return
	}

	if ctype == "standard" && points <= 0 {
		c.JSON(400, gin.H{"error": "invalid points"})
		return
	}

	if ctype == "dynamic" {
		if initialValue <= 0 || decay <= 0 || minValue < 0 {
			c.JSON(400, gin.H{"error": "invalid dynamic params"})
			return
		}
	}

	// 🔥 FLAG HANDLING
	flagValue := flag
	if flagType == "static" {
		flagValue = utils.HashFlag(flag)
	}

	query := `
	INSERT INTO challenges (
		title, description, category, difficulty,
		type,
		points,
		initial_value, decay, min_value,
		flag_hash,
		flag_type, case_sensitive,
		state, max_attempts,
		author, tags, hints,
		file_url
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
	`

	_, err = database.DB.Exec(query,
		title,
		description,
		category,
		difficulty,

		ctype,

		points,

		initialValue,
		decay,
		minValue,

		flagValue,

		flagType,
		caseSensitive,

		state,
		maxAttempts,

		author,
		pq.Array(tags),
		pq.Array(hints),

		filePath,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "challenge created"})
}

func GetAllChallenges(c *gin.Context) {

	userID := c.GetInt("user_id")

	rows, err := database.DB.Query(`
    SELECT 
        ch.id,
        ch.title,
        ch.description,
        ch.category,
        ch.difficulty,
        ch.type,
        ch.points,
        ch.tags,
        ch.hints,
        ch.file_url,

        COUNT(s.id) FILTER (WHERE s.is_correct = true) AS solve_count,

        EXISTS (
            SELECT 1 
            FROM submissions s2
            JOIN participants p2 ON s2.participant_id = p2.id
            WHERE p2.user_id = $1 
            AND s2.challenge_id = ch.id 
            AND s2.is_correct = true
        ) AS solved

    FROM challenges ch
    LEFT JOIN submissions s ON s.challenge_id = ch.id

    WHERE ch.state = 'visible'
    GROUP BY ch.id
`, userID) // ✅ THIS FIX
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch challenges"})
		return
	}
	defer rows.Close()

	type Challenge struct {
		ID          int      `json:"id"`
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Category    string   `json:"category"`
		Difficulty  string   `json:"difficulty"`
		Type        string   `json:"type"`
		Points      int      `json:"points"`
		Tags        []string `json:"tags"`
		Hints       []string `json:"hints"`
		FileURL     string   `json:"file_url"`

		SolveCount int  `json:"solve_count"`
		Solved     bool `json:"solved"`
	}

	var challenges []Challenge

	for rows.Next() {
		var ch Challenge

		err := rows.Scan(
			&ch.ID,
			&ch.Title,
			&ch.Description,
			&ch.Category,
			&ch.Difficulty,
			&ch.Type,
			&ch.Points,
			pq.Array(&ch.Tags),
			pq.Array(&ch.Hints),
			&ch.FileURL,
			&ch.SolveCount,
			&ch.Solved,
		)

		if err != nil {
			continue
		}

		challenges = append(challenges, ch)
	}

	c.JSON(200, challenges)
}

func UpdateChallenge(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	var req CreateChallengeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	// 🔥 NORMALIZE
	req.Difficulty = normalize(req.Difficulty)
	req.Category = normalize(req.Category)
	req.Type = normalize(req.Type)
	req.State = normalize(req.State)
	req.FlagType = normalize(req.FlagType)

	// 🔥 DEFAULTS
	if req.Type == "" {
		req.Type = "standard"
	}
	if req.State == "" {
		req.State = "visible"
	}
	if req.FlagType == "" {
		req.FlagType = "static"
	}

	// 🔥 VALIDATION
	if req.Title == "" || req.Description == "" {
		c.JSON(400, gin.H{"error": "missing required fields"})
		return
	}

	if req.Type == "standard" && req.Points <= 0 {
		c.JSON(400, gin.H{"error": "invalid points"})
		return
	}

	if req.Type == "dynamic" {
		if req.InitialValue <= 0 || req.Decay <= 0 || req.MinValue < 0 {
			c.JSON(400, gin.H{"error": "invalid dynamic params"})
			return
		}
	}

	// 🔥 FLAG HANDLING (IMPORTANT FIX)
	var flagValue interface{}

	if req.Flag != "" {
		if req.FlagType == "static" {
			flagValue = utils.HashFlag(req.Flag)
		} else {
			flagValue = req.Flag
		}
	} else {
		// keep existing flag
		flagValue = nil
	}

	// 🔥 QUERY (conditional flag update)
	query := `
	UPDATE challenges SET
		title=$1,
		description=$2,
		category=$3,
		difficulty=$4,
		type=$5,
		points=$6,
		initial_value=$7,
		decay=$8,
		min_value=$9,
		flag_hash = COALESCE($10, flag_hash),
		flag_type=$11,
		case_sensitive=$12,
		state=$13,
		max_attempts=$14,
		author=$15,
		tags=$16,
		hints=$17
	WHERE id=$18
	`

	_, err = database.DB.Exec(query,
		req.Title,
		req.Description,
		req.Category,
		req.Difficulty,
		req.Type,
		req.Points,
		req.InitialValue,
		req.Decay,
		req.MinValue,
		flagValue,
		req.FlagType,
		req.CaseSensitive,
		req.State,
		req.MaxAttempts,
		req.Author,
		pq.Array(req.Tags),
		pq.Array(req.Hints),
		id,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "challenge updated"})
}

func DeleteChallenge(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	_, err = database.DB.Exec(`DELETE FROM challenges WHERE id=$1`, id)
	if err != nil {
		c.JSON(500, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(200, gin.H{"message": "challenge deleted"})
}

func GetChallengeByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var ch models.Challenge

	query := `
	SELECT id, title, description, category, difficulty,
	       type, points, initial_value, decay, min_value,
	       flag_type, case_sensitive, state, max_attempts,
	       author, tags, hints
	FROM challenges
	WHERE id=$1
	`

	err := database.DB.QueryRow(query, id).Scan(
		&ch.ID,
		&ch.Title,
		&ch.Description,
		&ch.Category,
		&ch.Difficulty,
		&ch.Type,
		&ch.Points,
		&ch.InitialValue,
		&ch.Decay,
		&ch.MinValue,
		&ch.FlagType,
		&ch.CaseSensitive,
		&ch.State,
		&ch.MaxAttempts,
		&ch.Author,
		pq.Array(&ch.Tags),
		pq.Array(&ch.Hints),
	)

	if err != nil {
		c.JSON(404, gin.H{"error": "not found"})
		return
	}

	c.JSON(200, ch)
}
