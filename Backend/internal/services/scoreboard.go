package services

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"fmt"

	"github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

type ScoreEntry struct {
	Rank  int     `json:"rank"`
	Name  string  `json:"name"`
	Type  string  `json:"type"`
	Score float64 `json:"score"`
}

func GetScoreboard() ([]ScoreEntry, error) {

	results, err := cache.RDB.ZRevRangeWithScores(cache.Ctx, "leaderboard", 0, 9).Result()
	if err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return []ScoreEntry{}, nil
	}

	// 🔥 Step 1: collect participant IDs
	ids := make([]string, 0)
	for _, r := range results {
		ids = append(ids, fmt.Sprint(r.Member))
	}

	// 🔥 Step 2: fetch all participant info in ONE query
	query := `
	SELECT p.id, p.type, u.username, t.name
	FROM participants p
	LEFT JOIN users u ON p.user_id = u.id
	LEFT JOIN teams t ON p.team_id = t.id
	WHERE p.id = ANY($1)
	`

	rows, err := database.DB.Query(query, pq.Array(ids))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 🔥 Step 3: map participant_id → name/type
	type Info struct {
		Name string
		Type string
	}

	infoMap := make(map[string]Info)

	for rows.Next() {
		var id int
		var pType string
		var username *string
		var teamName *string

		err := rows.Scan(&id, &pType, &username, &teamName)
		if err != nil {
			continue
		}

		var name string
		if pType == "team" && teamName != nil {
			name = *teamName
		} else if pType == "user" && username != nil {
			name = *username
		}

		infoMap[fmt.Sprint(id)] = Info{
			Name: name,
			Type: pType,
		}
	}

	// 🔥 Step 4: build leaderboard
	leaderboard := make([]ScoreEntry, 0)

	for i, r := range results {
		pid := fmt.Sprint(r.Member)

		info := infoMap[pid]

		leaderboard = append(leaderboard, ScoreEntry{
			Rank:  i + 1,
			Name:  info.Name,
			Type:  info.Type,
			Score: r.Score,
		})
	}

	return leaderboard, nil
}

func RebuildLeaderboard() error {

	// clear Redis
	err := cache.RDB.Del(cache.Ctx, "leaderboard").Err()
	if err != nil {
		return err
	}

	rows, err := database.DB.Query(`
		SELECT s.participant_id, SUM(c.points)
		FROM submissions s
		JOIN challenges c ON s.challenge_id = c.id
		WHERE s.is_correct = true
		GROUP BY s.participant_id
	`)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var pid int
		var score int

		if err := rows.Scan(&pid, &score); err != nil {
			continue
		}

		err = cache.RDB.ZAdd(cache.Ctx, "leaderboard", redis.Z{
			Score:  float64(score),
			Member: fmt.Sprint(pid),
		}).Err()

		if err != nil {
			continue
		}
	}

	return nil
}
