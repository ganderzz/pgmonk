package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

//IsOriginValid .
func IsOriginValid(writer http.ResponseWriter, reader *http.Request) bool {
	origin := reader.Header.Get("Origin")
	host := "http://localhost:3000"

	if origin != host {
		if writer != nil {
			http.Error(writer, "Origin not allowed.", http.StatusForbidden)
		}

		return false
	}

	return true
}

//WriteJSON .
func WriteJSON(writer http.ResponseWriter, obj interface{}) {
	json, err := json.Marshal(obj)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.Write(json)
}

//SetCors .
func SetCors(writer http.ResponseWriter, reader *http.Request) {
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "*")
	writer.Header().Set("Access-Control-Allow-Headers", "*")
	writer.Header().Set("Access-Control-Allow-Credentials", "*")
	writer.Header().Set("Access-Control-Expose-Headers", "*")

	if reader.Method == "OPTIONS" {
		writer.WriteHeader(http.StatusOK)
		writer.Write(nil)
		return
	}
}

//GetMostRecentFileInDir .
func GetMostRecentFileInDir(dirPath string) (os.FileInfo, error) {
	files, err := ioutil.ReadDir(dirPath)

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return nil, err
	}

	var recentLog os.FileInfo

	for _, file := range files {
		if recentLog == nil {
			recentLog = file
		} else if recentLog.ModTime().Before(file.ModTime()) {
			recentLog = file
		}
	}

	return recentLog, nil
}
