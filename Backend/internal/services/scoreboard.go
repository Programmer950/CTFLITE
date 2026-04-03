package services

import (
	"Backend/internal/cache"
	"Backend/internal/database"
)

type ScoreEntry struct {
	Name  string  `json:"name"`
	Type  string  `json:"type"`
	Score float64 `json:"score"`
}

func GetScoreboard() ([]ScoreEntry, error) {

	results, err := cache.RDB.ZRevRangeWithScores(cache.Ctx, "leaderboard", 0, 9).Result()
	if err != nil {
		return nil, err
	}

	leaderboard := make([]ScoreEntry, 0)

	for _, r := range results {

		participantID := r.Member.(string)

		var name string
		var pType string

		// 🔍 Find participant type
		err := database.DB.QueryRow(
			`SELECT type, user_id, team_id FROM participants WHERE id=$1`,
			participantID,
		).Scan(&pType, new(interface{}), new(interface{}))

		if err != nil {
			continue
		}

		// 🧠 If team
		if pType == "team" {
			err = database.DB.QueryRow(
				`SELECT t.name
				 FROM teams t
				 JOIN participants p ON p.team_id = t.id
				 WHERE p.id=$1`,
				participantID,
			).Scan(&name)
		} else {
			// 🧠 If user
			err = database.DB.QueryRow(
				`SELECT u.username
				 FROM users u
				 JOIN participants p ON p.user_id = u.id
				 WHERE p.id=$1`,
				participantID,
			).Scan(&name)
		}

		if err != nil {
			continue
		}

		leaderboard = append(leaderboard, ScoreEntry{
			Name:  name,
			Type:  pType,
			Score: r.Score,
		})
	}

	return leaderboard, nil
}
