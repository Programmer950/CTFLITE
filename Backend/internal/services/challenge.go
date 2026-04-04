package services

import (
	"Backend/internal/database"
)

type Challenge struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Points      int    `json:"points"`
	Category    string `json:"category"`
	Difficulty  string `json:"difficulty"`
	Solved      bool   `json:"solved"`
	SolveCount  int    `json:"solve_count"`
}

func GetChallenges(participantID int) ([]Challenge, error) {

	query := `
	SELECT 
		c.id,
		c.title,
		c.description,
		c.points,
		c.category,
		c.difficulty,
	
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
	`

	rows, err := database.DB.Query(query, participantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	challenges := make([]Challenge, 0)

	for rows.Next() {
		var ch Challenge

		err := rows.Scan(
			&ch.ID,
			&ch.Title,
			&ch.Description,
			&ch.Points,
			&ch.Category,
			&ch.Difficulty,
			&ch.Solved,
			&ch.SolveCount,
		)
		
		if err != nil {
			return nil, err
		}

		challenges = append(challenges, ch)
	}

	return challenges, nil
}
