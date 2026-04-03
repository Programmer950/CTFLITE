package cache

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client
var Ctx = context.Background()

func ConnectRedis() {
	addr := os.Getenv("REDIS_ADDR")

	RDB = redis.NewClient(&redis.Options{
		Addr: addr,
	})

	_, err := RDB.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("Redis not connected:", err)
	}

	log.Println("Connected to Redis")
}
