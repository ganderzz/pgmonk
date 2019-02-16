package controllers

import (
	"github/com/ganderzz/pgmonk/src/server/utils"
	"net/http"

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
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
			state as State,
			client_addr as ClientAddr,
			client_hostname as ClientHostname,
			client_port as ClientPort,
			pg_blocking_pids(pid) as BlockedBy
		FROM pg_stat_activity
		WHERE backend_type = $1
		ORDER BY query_start DESC NULLS LAST`, backendType)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, output)
}
