package services

import (
	"Backend/internal/cache"
	"Backend/internal/database"
	"Backend/internal/utils"
	"fmt"
	"regexp"
	"strings"
	"time"
)

func SubmitFlag(participantID int, challengeID int, flag string) (bool, error) {

	var correctFlag string
	var flagType string
	var caseSensitive bool

	var chType string
	var points int
	var initialValue, decay, minValue int

	// 🔒 Rate limiting / ban
	banKey := fmt.Sprintf("ban:%d", participantID)
	banned, _ := cache.RDB.Exists(cache.Ctx, banKey).Result()
	if banned == 1 {
		return false, fmt.Errorf("temporarily blocked")
	}

	challengeKey := fmt.Sprintf("attempt:%d:%d", participantID, challengeID)
	count, _ := cache.RDB.Incr(cache.Ctx, challengeKey).Result()

	if count == 1 {
		cache.RDB.Expire(cache.Ctx, challengeKey, 5*time.Minute)
	}

	if count > 10 {
		return false, fmt.Errorf("too many attempts for this challenge")
	}

	// 🧠 Get challenge data
	query := `
	SELECT flag_hash, flag_type, case_sensitive, type, points, initial_value, decay, min_value
	FROM challenges
	WHERE id=$1
	`

	err := database.DB.QueryRow(query, challengeID).Scan(
		&correctFlag,
		&flagType,
		&caseSensitive,
		&chType,
		&points,
		&initialValue,
		&decay,
		&minValue,
	)
	if err != nil {
		return false, err
	}

	// 🧠 Already solved check
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

	// =========================
	// 🔥 FLAG VALIDATION
	// =========================

	isCorrect := false

	if flagType == "regex" {

		input := flag
		pattern := correctFlag

		if !caseSensitive {
			input = strings.ToLower(input)
			pattern = strings.ToLower(pattern)
		}

		matched, _ := regexp.MatchString(pattern, input)
		isCorrect = matched

	} else {
		// ⚠️ DO NOT modify input before hashing
		hashed := utils.HashFlag(flag)
		isCorrect = (hashed == correctFlag)
	}

	// 🔍 Debug logs
	fmt.Println("Input flag:", flag)
	fmt.Println("Stored hash:", correctFlag)
	fmt.Println("Input hash:", utils.HashFlag(flag))
	fmt.Println("Is correct?", isCorrect)

	// =========================
	// 🎯 IF CORRECT
	// =========================

	if isCorrect {

		if chType == "dynamic" {
			var solveCount int

			err = database.DB.QueryRow(`
				SELECT COUNT(*) FROM submissions
				WHERE challenge_id=$1 AND is_correct=true
			`, challengeID).Scan(&solveCount)

			if err == nil {
				points = initialValue - decay*solveCount
				if points < minValue {
					points = minValue
				}
			}
		}

		if err != nil {
			return false, err
		}

		// 🏆 Update leaderboard
		_, err = cache.RDB.ZIncrBy(
			cache.Ctx,
			"leaderboard",
			float64(points),
			fmt.Sprint(participantID),
		).Result()

		if err != nil {
			return false, err
		}

	} else {

		// 🚫 Anti-bruteforce
		failKey := fmt.Sprintf("fail:%d", participantID)

		failCount, _ := cache.RDB.Incr(cache.Ctx, failKey).Result()

		if failCount == 1 {
			cache.RDB.Expire(cache.Ctx, failKey, 10*time.Minute)
		}

		if failCount > 30 {
			cache.RDB.Set(cache.Ctx, fmt.Sprintf("ban:%d", participantID), 1, 15*time.Minute)
		}

		if failCount > 20 {
			return false, fmt.Errorf("too many wrong attempts, try later")
		}
	}

	// =========================
	// 💾 STORE SUBMISSION
	// =========================

	insert := `
	INSERT INTO submissions (participant_id, challenge_id, is_correct, provided_flag)
	VALUES ($1, $2, $3, $4)
	`

	_, err = database.DB.Exec(insert,
		participantID,
		challengeID,
		isCorrect,
		flag,
	)

	if err != nil {
		return false, err
	}

	return isCorrect, nil
}
