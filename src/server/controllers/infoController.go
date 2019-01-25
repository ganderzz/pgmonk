package controllers

import (
	"database/sql"
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/utils"
	"net/http"
	"strings"

	null "gopkg.in/guregu/null.v3"
)

//ConnectionString .
var ConnectionString string

type BlockedBy struct {
	Array []uint8
}

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
	Datid            null.Int
	Datname          null.String
	Pid              null.Int
	Usename          null.String
	Query            null.String
	State            null.String
	Application_Name null.String
	Client_Addr      null.String
	Client_Hostname  null.String
	Client_Port      null.Int
	Blocked_By       *BlockedBy
	blockedBy        []uint8
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
		return &item.Application_Name
	case "client_addr":
		return &item.Client_Addr
	case "client_hostname":
		return &item.Client_Hostname
	case "client_port":
		return &item.Client_Port
	case "blocked_by":
		item.Blocked_By = &BlockedBy{Array: item.blockedBy}
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

	rows, err := db.Query(`
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
		WHERE backend_type = 'client backend'
		ORDER BY query_start DESC NULLS LAST`)

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
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
