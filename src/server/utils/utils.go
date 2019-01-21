package utils

import (
	"encoding/json"
	"net/http"
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
	js, err := json.Marshal(obj)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.Write(js)
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
