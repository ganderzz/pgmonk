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
	DateTime time.Time   `json:"date_time,omitempty"`
	Pid      int         `json:"pid,omitempty"`
	Message  string      `json:"message,omitempty"`
	Meta     MetaLogInfo `json:"meta,omitempty"`
	Status   string      `json:"status,omitempty"`
}

//MetaLogInfo additional info on a log item
type MetaLogInfo struct {
	User   string `json:"user,omitempty"`
	DB     string `json:"db,omitempty"`
	App    string `json:"app,omitempty"`
	Client string `json:"client,omitempty"`
}

//GetInfoFromLogs .
func GetInfoFromLogs(fileData []byte) []LogInfo {
	formattedData := DateTimeRegExp.ReplaceAllString(string(fileData), "|^_^| $1-$2-$3")
	splitData := strings.Split(string(formattedData), "|^_^|")

	var temp []LogInfo

	for i := 1; i < len(splitData); i++ {
		splitRow := strings.Split(strings.Trim(splitData[i], " "), " ")

		var dateTime time.Time
		var meta MetaLogInfo
		pid := 0
		message := ""
		status := ""

		// Parse Created DateTime
		if len(splitRow) >= 3 {
			dateTimeString := splitRow[0] + " " + splitRow[1] + " " + splitRow[2]
			dateTime, _ = time.Parse("2006-01-02 15:04:05 MST", dateTimeString)
		}

		// Parse Process ID
		if len(splitRow) >= 4 {
			pidString := strings.Replace(splitRow[3], "[", "", -1)
			pidString = strings.Replace(pidString, "]:", "", -1)
			pidString = strings.Trim(pidString, " ")

			pid, _ = strconv.Atoi(pidString)
		}

		// Get meta data about the log
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

		// Get the log status
		if len(splitRow) >= 6 {
			status = strings.Replace(splitRow[6], ":", "", -1)
		}

		// Get the log message
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

//MakeConnectionString creates a connection string
func MakeConnectionString(user string, password string, db string, host string) string {
	return "application_name=PgMonk user=" + user + " password=" + password + " dbname=" + db + " host=" + host + " sslmode=disable"
}

/* --- RegExp --- */

//DateTimeRegExp parses datetime values at a beginning of the line
var DateTimeRegExp = regexp.MustCompile("(?m)^([0-9]{4})-([0-9]{2})-([0-9]{2})")
