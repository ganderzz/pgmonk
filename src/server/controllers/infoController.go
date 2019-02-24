package controllers

import (
	"github/com/ganderzz/pgmonk/utils"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"

	null "gopkg.in/guregu/null.v3"
)

//ConnectionString .
var ConnectionString string

// PostgresInfo .
type PostgresInfo struct {
	Datid           null.Int    `json:"datid,omitempty"`
	Datname         null.String `json:"datname,omitempty"`
	Pid             null.Int    `json:"pid,omitempty"`
	Usename         null.String `json:"username,omitempty"`
	Query           null.String `json:"query,omitempty"`
	QueryStart      time.Time   `json:"query_start,omitempty"`
	State           null.String `json:"state,omitempty"`
	ApplicationName null.String `json:"application_name,omitempty"`
	ClientAddr      null.String `json:"client_address,omitempty"`
	ClientHostname  null.String `json:"client_hostname,omitempty"`
	ClientPort      null.Int    `json:"client_port,omitempty"`
	BlockedBy       []uint8     `json:"blocked_by,omitempty"`
}

//HandleGetInfo Get recently ran queries
func HandleGetInfo(w http.ResponseWriter, r *http.Request) {
	db, err := sqlx.Open("postgres", ConnectionString)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	defer db.Close()

	query := r.URL.Query()
	backendType := query.Get("backend_type")

	output := []PostgresInfo{}
	err = db.Select(&output, `
		SELECT 
			datid as DatId,
			datname as DatName,
			pid as Pid,
			application_name as ApplicationName,
			usename as Usename,
			query as Query,
			query_start as QueryStart,
			state as State,
			client_addr as ClientAddr,
			client_hostname as ClientHostname,
			client_port as ClientPort,
			pg_blocking_pids(pid) as BlockedBy
		FROM pg_stat_activity
		WHERE backend_type = $1
		ORDER BY query_start DESC NULLS LAST`, backendType)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	utils.WriteJSON(w, output)
}

//StatStatement .
type StatStatement struct {
	AverageTime  float32 `json:"average_time,omitempty"`
	DatabaseName string  `json:"database_name,omitempty"`
	Query        string  `json:"query,omitempty"`
}

//HandleStatStatements .
func HandleStatStatements(w http.ResponseWriter, r *http.Request) {
	db, err := sqlx.Open("postgres", ConnectionString)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	defer db.Close()

	output := []StatStatement{}
	err = db.Select(&output, `
		SELECT 
			(total_time/calls) as AverageTime, 
			query as Query,
			datname as DatabaseName
		FROM pg_stat_statements 
		LEFT JOIN pg_database db on db.oid = dbid
		ORDER BY AverageTime DESC 
		LIMIT 50
	`)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	utils.WriteJSON(w, output)
}
