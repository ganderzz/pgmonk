package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

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

//LogInfo information coming from log file
type LogInfo struct {
	DateTime time.Time
	Pid      int
	Message  string
	Meta     MetaLogInfo
	Status   string
}

//MetaLogInfo additional info on a log item
type MetaLogInfo struct {
	User   string
	DB     string
	App    string
	Client string
}

//GetInfoFromLogs .
func GetInfoFromLogs(fileData []byte) []LogInfo {
	s := regexp.MustCompile("([0-9]{4})-([0-9]{2})-([0-9]{2})")
	formattedData := s.ReplaceAllString(string(fileData), "|^_^| $1-$2-$3")
	splitData := strings.Split(string(formattedData), "|^_^|")

	var temp []LogInfo

	for i := 1; i < len(splitData)-1; i++ {
		splitRow := strings.Split(strings.Trim(splitData[i], " "), " ")

		var dateTime time.Time
		var meta MetaLogInfo
		pid := 0
		message := ""
		status := ""

		if len(splitRow) >= 3 {
			dateTimeString := splitRow[0] + " " + splitRow[1] + " " + splitRow[2]
			dateTime, _ = time.Parse("2006-01-02 15:04:05 MST", dateTimeString)
		}

		if len(splitRow) >= 4 {
			pidString := strings.Trim(strings.Trim(splitRow[3], "["), "]")
			pid, _ = strconv.Atoi(pidString)
		}

		if len(splitRow) >= 5 {
			csvMeta := strings.Split(splitRow[5], ",")

			var user, db, app, client string

			if len(csvMeta) > 0 {
				user = strings.Split(csvMeta[0], "=")[1]
			}

			if len(csvMeta) > 1 {
				user = strings.Split(csvMeta[1], "=")[1]
			}

			if len(csvMeta) > 2 {
				user = strings.Split(csvMeta[2], "=")[1]
			}

			if len(csvMeta) > 3 {
				user = strings.Split(csvMeta[3], "=")[1]
			}

			meta = MetaLogInfo{
				User:   user,
				DB:     db,
				App:    app,
				Client: client,
			}
		}

		if len(splitRow) >= 6 {
			status = strings.Replace(splitRow[6], ":", "", -1)
		}

		if len(splitRow) >= 7 {
			message = strings.Trim(strings.Join(splitRow[7:], " "), " ")
		}

		temp = append(temp, LogInfo{
			DateTime: dateTime,
			Pid:      pid,
			Message:  message,
			Status:   status,
			Meta:     meta,
		})
	}

	return temp
}
