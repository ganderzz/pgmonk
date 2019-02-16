package controllers

import (
	"database/sql"
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/utils"
	"io/ioutil"
	"net/http"
	"strings"

	null "gopkg.in/guregu/null.v3"
)

//ConnectionString .
var ConnectionString string

// BlockedBy struct
type BlockedBy struct {
	Array []uint8
}

//MarsalJSON transform BlockedBy to JSON object
func (bb *BlockedBy) MarshalJSON() ([]byte, error) {
	var array string
	if bb.Array == nil {
		array = "null"
	} else {
		array = strings.Join(strings.Fields(fmt.Sprintf("%d", bb.Array)), ",")
	}
	jsonResult := fmt.Sprintf(`[%s]`, array)
	return []byte(jsonResult), nil
}

// PostgresInfo .
type PostgresInfo struct {
	Datid           null.Int    `json:"datid,omitempty"`
	Datname         null.String `json:"datname,omitempty"`
	Pid             null.Int    `json:"pid,omitempty"`
	Usename         null.String `json:"username,omitempty"`
	Query           null.String `json:"query,omitempty"`
	State           null.String `json:"state,omitempty"`
	ApplicationName null.String `json:"application_name,omitempty"`
	ClientAddr      null.String `json:"client_address,omitempty"`
	ClientHostname  null.String `json:"client_hostname,omitempty"`
	ClientPort      null.Int    `json:"client_port,omitempty"`
	BlockedBy       *BlockedBy  `json:"blocked_by,omitempty"`
	blockedBy       []uint8
}

func parseInfoColumns(name string, item *PostgresInfo) interface{} {
	switch name {
	case "datid":
		return &item.Datid
	case "datname":
		return &item.Datname
	case "pid":
		return &item.Pid
	case "usename":
		return &item.Usename
	case "query":
		return &item.Query
	case "state":
		return &item.State
	case "application_name":
		return &item.ApplicationName
	case "client_addr":
		return &item.ClientAddr
	case "client_hostname":
		return &item.ClientHostname
	case "client_port":
		return &item.ClientPort
	case "blocked_by":
		item.BlockedBy = &BlockedBy{Array: item.blockedBy}
		return &item.blockedBy

	default:
		panic("Unknown column provided")
	}
}

func getPostgresInfoFromDBRow(rows *sql.Rows, columns []string) ([]PostgresInfo, error) {
	var p []PostgresInfo
	columnLength := len(columns)

	for rows.Next() {
		tempP := PostgresInfo{}
		cols := make([]interface{}, columnLength)

		for i := 0; i < columnLength; i++ {
			cols[i] = parseInfoColumns(columns[i], &tempP)
		}

		err := rows.Scan(cols...)
		if err != nil {
			return p, err
		}

		p = append(p, tempP)
	}

	return p, nil
}

//GetPostgresInfoController .
func GetPostgresInfoController(writer http.ResponseWriter, reader *http.Request) {
	if !utils.IsOriginValid(writer, reader) {
		return
	}

	utils.SetCors(writer, reader)

	if reader.Method != "GET" {
		http.Error(writer, "Method not GET", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("postgres", ConnectionString)
	if err != nil {
		return
	}

	defer db.Close()

	query := reader.URL.Query()

	backendType := query.Get("backend_type")

	var rows *sql.Rows

	if backendType == "" {
		stmt, _ := db.Prepare(`
		SELECT 
			datid,
			datname,
			pid,
			application_name,
			usename,
			query,
			state,
			client_addr,
			client_hostname,
			client_port,
			pg_blocking_pids(pid) as blocked_by
		FROM pg_stat_activity
		ORDER BY query_start DESC NULLS LAST`)

		if err != nil {
			fmt.Printf("ERROR: %s", err.Error())
			return
		}

		rows, _ = stmt.Query()
	} else {
		stmt, _ := db.Prepare(`
		SELECT 
			datid,
			datname,
			pid,
			application_name,
			usename,
			query,
			state,
			client_addr,
			client_hostname,
			client_port,
			pg_blocking_pids(pid) as blocked_by
		FROM pg_stat_activity
		WHERE backend_type = $1
		ORDER BY query_start DESC NULLS LAST`)

		if err != nil {
			fmt.Printf("ERROR: %s", err.Error())
			return
		}

		rows, _ = stmt.Query(backendType)
	}

	columns, err := rows.Columns()
	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	p, err := getPostgresInfoFromDBRow(rows, columns)

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	utils.WriteJSON(writer, p)
}

//GetPostgresLogsController .
func GetPostgresLogsController(writer http.ResponseWriter, reader *http.Request) {
	if !utils.IsOriginValid(writer, reader) {
		return
	}

	utils.SetCors(writer, reader)

	if reader.Method != "GET" {
		http.Error(writer, "Method not GET", http.StatusBadRequest)
		return
	}

	file, err := utils.GetMostRecentFileInDir("C:\\PostgreSQL\\data\\logs\\pg11")

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	data, err := ioutil.ReadFile("C:\\PostgreSQL\\data\\logs\\pg11\\" + file.Name())

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	utils.WriteJSON(writer, utils.GetInfoFromLogs(data))
}
