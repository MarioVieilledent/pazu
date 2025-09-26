package main

import (
	"encoding/json"
	"errors"
	"os"
)

// Write a key-value pair to the JSON database if the provided password matches
func write(key string, value any, pwd string) error {
	if pwd == PWD {
		// Read file
		bytes, err := os.ReadFile(dbFilePath)
		if err != nil {
			return err
		}

		// Unmarshal or init
		var db map[string]any
		if len(bytes) == 0 {
			db = make(map[string]any)
		} else {
			err = json.Unmarshal(bytes, &db)
			if err != nil {
				return err
			}
		}

		// Update and write back
		db[key] = value
		newBytes, err := json.MarshalIndent(db, "", "  ")
		if err != nil {
			return err
		}

		// Write file
		err = os.WriteFile(dbFilePath, newBytes, 0644)
		if err != nil {
			return err
		}

		return nil
	} else {
		return errors.New("permission denied")
	}
}

// Read a value by key from the JSON database if the provided password matches
func read(key string, pwd string) (any, error) {
	if pwd == PWD {
		// Read file
		bytes, err := os.ReadFile(dbFilePath)
		if err != nil {
			return nil, err
		}

		// Unmarshal
		var db map[string]any
		err = json.Unmarshal(bytes, &db)
		if err != nil {
			return nil, err
		}

		// Return value
		val, exists := db[key]
		if exists {
			return val, nil
		} else {
			return nil, nil
		}
	} else {
		return nil, errors.New("permission denied")
	}
}

// Read all database
func readAll(pwd string) (map[string]any, error) {
	if pwd == PWD {
		// Read file
		bytes, err := os.ReadFile(dbFilePath)
		if err != nil {
			return nil, err
		}

		// Unmarshal
		var db map[string]any
		err = json.Unmarshal(bytes, &db)
		if err != nil {
			return nil, err
		}
		return db, nil
	} else {
		return nil, errors.New("permission denied")
	}
}
