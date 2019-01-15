package utils

import (
	"encoding/json"
	"net/http"
	"strconv"
)

//IsOriginValid .
func IsOriginValid(writer http.ResponseWriter, reader *http.Request) bool {
	origin := reader.Header.Get("Origin") + ":" + strconv.Itoa(5000)
	host := "localhost:5000"

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
