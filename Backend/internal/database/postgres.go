package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error

	// 🔥 Retry loop
	for i := 0; i < 10; i++ {
		DB, err = sql.Open("postgres", connStr)
		if err != nil {
			log.Println("DB open error:", err)
			time.Sleep(2 * time.Second)
			continue
		}

		err = DB.Ping()
		if err == nil {
			log.Println("Connected to PostgreSQL")
			return
		}

		log.Println("Waiting for DB...", err)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("Could not connect to DB after retries")
}
