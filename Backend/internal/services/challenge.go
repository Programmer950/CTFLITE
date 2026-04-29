package services

import (
	"Backend/internal/database"
	"Backend/internal/models"
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

func GetChallenges(participantID int) ([]models.Challenge, error) {

	query := `
	SELECT 
		c.id,
		c.title,
		c.description,
		c.category,
		c.difficulty,
		c.type,
		c.points,
		c.initial_value,
		c.decay,
		c.min_value,

		-- solved by current user
		EXISTS (
			SELECT 1 FROM submissions s
			WHERE s.challenge_id = c.id
			AND s.participant_id = $1
			AND s.is_correct = true
		),

		-- total solves
		(
			SELECT COUNT(*) FROM submissions s
			WHERE s.challenge_id = c.id
			AND s.is_correct = true
		)

	FROM challenges c
	WHERE c.state = 'visible'
	`

	rows, err := database.DB.Query(query, participantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	challenges := make([]models.Challenge, 0)

	for rows.Next() {
		var ch models.Challenge

		var initialValue, decay, minValue int

		err := rows.Scan(
			&ch.ID,
			&ch.Title,
			&ch.Description,
			&ch.Category,
			&ch.Difficulty,
			&ch.Type,
			&ch.Points,
			&initialValue,
			&decay,
			&minValue,
			&ch.Solved,
			&ch.SolveCount,
		)

		if err != nil {
			return nil, err
		}

		// 🔥 BACKWARD COMPATIBILITY
		if ch.Type == "" {
			ch.Type = "standard"
		}

		// 🔥 DYNAMIC SCORING
		if ch.Type == "dynamic" {
			score := initialValue - decay*ch.SolveCount
			if score < minValue {
				score = minValue
			}
			ch.Points = score
		}

		challenges = append(challenges, ch)
	}

	return challenges, nil
}
