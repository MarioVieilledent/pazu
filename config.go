package main

import "os"

const dbFilePath = "database.json"

var PWD = os.Getenv("PWD")

func init() {
	if PWD == "" {
		PWD = "localPassword"
	}
}
