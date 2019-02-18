package controllers

import (
	"github/com/ganderzz/pgmonk/src/server/utils"
	"io/ioutil"
	"net/http"
	"time"
)

//LogInfoParent Postgres loginfo with the current datetime
type LogInfoParent struct {
	Data     []utils.LogInfo `json:"data,omitempty"`
	DateTime time.Time       `json:"date_time,omitempty"`
}

//HandleGetLogs Get most recent postgres logs (Usually by day)
func HandleGetLogs(w http.ResponseWriter, r *http.Request) {
	dir := "C:\\PostgreSQL\\data\\logs\\pg11\\"

	files, err := ioutil.ReadDir(dir)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var logInfo []LogInfoParent

	for _, file := range files {
		data, err := ioutil.ReadFile(dir + file.Name())

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		logInfo = append(logInfo, LogInfoParent{
			Data:     utils.GetInfoFromLogs(data),
			DateTime: file.ModTime(),
		})
	}

	utils.WriteJSON(w, logInfo)
}
