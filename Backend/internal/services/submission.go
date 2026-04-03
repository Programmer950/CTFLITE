package services

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"fmt"
)

func SubmitFlag(participantID int, challengeID int, flag string) (bool, error) {

	var correctFlag string

	// 1. Get flag from DB
	query := `SELECT flag_hash FROM challenges WHERE id=$1`
	err := database.DB.QueryRow(query, challengeID).Scan(&correctFlag)
	if err != nil {
		return false, err
	}

	// 2. Check if already solved
	var exists bool
	checkQuery := `
	SELECT EXISTS(
		SELECT 1 FROM submissions
		WHERE participant_id=$1 AND challenge_id=$2 AND is_correct=true
	)`
	err = database.DB.QueryRow(checkQuery, participantID, challengeID).Scan(&exists)
	if err != nil {
		return false, err
	}

	if exists {
		return false, nil
	}

	// 3. Validate flag
	isCorrect := (flag == correctFlag)
	fmt.Println("Input flag:", flag)
	fmt.Println("Correct flag:", correctFlag)
	fmt.Println("Is correct?", isCorrect)

	if isCorrect {
		// get points
		var points int
		pointQuery := `SELECT points FROM challenges WHERE id=$1`
		err = database.DB.QueryRow(pointQuery, challengeID).Scan(&points)
		if err != nil {
			return false, err
		}

		// update Redis leaderboard
		_, err = cache.RDB.ZIncrBy(cache.Ctx, "leaderboard", float64(points), fmt.Sprint(participantID)).Result()
		if err != nil {
			return false, err
		}
	}

	// 4. Store submission
	insert := `
	INSERT INTO submissions (participant_id, challenge_id, is_correct)
	VALUES ($1, $2, $3)
	`
	_, err = database.DB.Exec(insert, participantID, challengeID, isCorrect)
	if err != nil {
		return false, err
	}

	return isCorrect, nil
}
