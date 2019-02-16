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

	for _, v := range splitData[1:] {
		splitRow := strings.Split(strings.Trim(v, " "), " ")

		var dateTime time.Time
		var meta MetaLogInfo
		pid := 0
		message := ""
		status := ""

		if len(splitRow) >= 3 {
			dateTimeString := splitRow[0] + " " + splitRow[1] + " " + splitRow[2]
			dateTime, _ = time.Parse("2006-01-02 15:04:05 MST", dateTimeString)
		}

		if len(splitRow) > 3 {
			pidString := strings.Trim(strings.Trim(splitRow[3], "["), "]")
			pid, _ = strconv.Atoi(pidString)
		}

		if len(splitRow) >= 5 {
			csvMeta := strings.Split(splitRow[5], ",")

			meta = MetaLogInfo{
				User:   strings.Split(csvMeta[0], "=")[1],
				DB:     strings.Split(csvMeta[1], "=")[1],
				App:    strings.Split(csvMeta[2], "=")[1],
				Client: strings.Split(csvMeta[3], "=")[1],
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
