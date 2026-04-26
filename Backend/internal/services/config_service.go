package services

import (
	"encoding/json"
	"os"
)

const configFile = "/app/config.json"

func GetConfig() (map[string]interface{}, error) {
	file, err := os.ReadFile(configFile)
	if err != nil {
		panic("CONFIG NOT FOUND: " + err.Error())
	}

	var config map[string]interface{}
	err = json.Unmarshal(file, &config)
	if err != nil {
		panic("INVALID JSON: " + err.Error())
	}

	return config, nil
}

func SaveConfig(config map[string]interface{}) error {
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(configFile, data, 0644)
}
