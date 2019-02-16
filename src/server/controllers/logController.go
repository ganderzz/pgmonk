package controllers

import (
	"github/com/ganderzz/pgmonk/src/server/utils"
	"io/ioutil"
	"net/http"
)

//HandleGetLogs Get most recent postgres logs (Usually by day)
func HandleGetLogs(w http.ResponseWriter, r *http.Request) {
	file, err := utils.GetMostRecentFileInDir("C:\\PostgreSQL\\data\\logs\\pg11")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := ioutil.ReadFile("C:\\PostgreSQL\\data\\logs\\pg11\\" + file.Name())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, utils.GetInfoFromLogs(data))
}
