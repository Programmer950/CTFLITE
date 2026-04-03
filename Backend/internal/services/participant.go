package services

import (
	"Backend/internal/database"
	"database/sql"
	"fmt"
)

func GetOrCreateParticipant(userID int) (int, error) {

	mode, err := GetMode()
	if err != nil {
		return 0, err
	}

	var participantID int

	// 🧠 TEAM MODE
	if mode == "team" {

		var teamID int

		err := database.DB.QueryRow(
			`SELECT team_id FROM team_members WHERE user_id=$1`,
			userID,
		).Scan(&teamID)

		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("user is not in a team")
		}

		if err != nil {
			return 0, err
		}

		err = database.DB.QueryRow(
			`SELECT id FROM participants WHERE team_id=$1`,
			teamID,
		).Scan(&participantID)

		if err == sql.ErrNoRows {
			err = database.DB.QueryRow(
				`INSERT INTO participants (type, team_id)
				 VALUES ('team', $1)
				 RETURNING id`,
				teamID,
			).Scan(&participantID)
		}

		return participantID, err
	}

	// 🧠 INDIVIDUAL MODE
	err = database.DB.QueryRow(
		`SELECT id FROM participants WHERE user_id=$1`,
		userID,
	).Scan(&participantID)

	if err == sql.ErrNoRows {
		err = database.DB.QueryRow(
			`INSERT INTO participants (type, user_id)
			 VALUES ('user', $1)
			 RETURNING id`,
			userID,
		).Scan(&participantID)
	}

	return participantID, err
}
