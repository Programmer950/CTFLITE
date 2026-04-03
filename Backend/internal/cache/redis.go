package cache

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client
var Ctx = context.Background()

func ConnectRedis() {
	RDB = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	_, err := RDB.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("Redis not connected")
	}

	log.Println("Connected to Redis")
}
