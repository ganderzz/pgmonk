package controllers

import (
	"errors"
	"github/com/ganderzz/pgmonk/utils"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	null "gopkg.in/guregu/null.v3"
)

//Database database
type Database struct {
	TableCatalog string `json:"table_catalog,omitempty"`
	TableSchema  string `json:"table_schema,omitempty"`
	TableName    string `json:"table_name,omitempty"`
	TableType    string `json:"table_type,omitempty"`
}

//HandleGetDatabases Get databases
func HandleGetDatabases(w http.ResponseWriter, r *http.Request) {
	db, err := sqlx.Open("postgres", ConnectionString)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	defer db.Close()

	var output []Database
	err = db.Select(&output,
		`SELECT 
			table_catalog as TableCatalog, 
			table_schema as TableSchema, 
			table_name as TableName, 
			table_type as TableType
		FROM information_schema.tables
		WHERE table_schema <> 'pg_catalog' 
			AND 
				table_schema <> 'information_schema'
			AND
				table_type <> 'VIEW'
		ORDER BY table_type`)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	utils.WriteJSON(w, output)
}

//TableInfo .
type TableInfo struct {
	Relname     string   `json:"table_name,omitempty"`
	SchemaName  string   `json:"schema_name,omitempty"`
	SeqTupRead  null.Int `json:"seq_reads,omitempty"`
	SeqScan     null.Int `json:"seq_scan,omitempty"`
	IdxScan     null.Int `json:"idx_scan,omitempty"`
	IdxTupFetch null.Int `json:"isx_tup_fetch,omitempty"`
	NTupIns     null.Int `json:"inserts,omitempty"`
	NTupUpd     null.Int `json:"updates,omitempty"`
	NTupDel     null.Int `json:"deletes,omitempty"`
}

//HandleGetDatabase Get databases
func HandleGetDatabase(w http.ResponseWriter, r *http.Request) {
	db, err := sqlx.Open("postgres", ConnectionString)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	defer db.Close()

	vars := mux.Vars(r)
	tableName := vars["name"]

	var output TableInfo
	err = db.Get(&output, `
		select 
			relname,
			schemaname,
			seq_scan as SeqScan,
			seq_tup_read as SeqTupRead,
			idx_scan as IdxScan,
			idx_tup_fetch as IdxTupFetch,
			n_tup_ins as NTupIns,
			n_tup_upd as NTupUpd,
			n_tup_del as NTupDel
		from pg_stat_all_tables 
		where relname=$1::text
		LIMIT 1
	`, tableName)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	utils.WriteJSON(w, output)
}

//HandleExplainQuery Analyze a query
func HandleExplainQuery(w http.ResponseWriter, r *http.Request) {
	db, err := sqlx.Open("postgres", ConnectionString)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	defer db.Close()
	defer r.Body.Close()

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	if len(body) == 0 {
		utils.WriteJSONError(w, errors.New("No body given"))
		return
	}

	var output []string
	var query string
	var args []interface{}

	if analyseExplainRegExp.Match(body) {
		//@TODO: Fix SQL injection issues
		query, args, err = sqlx.In(string(body))
	} else {
		//@TODO: Fix SQL injection issues
		query, args, err = sqlx.In(`explain analyse ` + string(body))
	}

	if err != nil {
		utils.WriteJSONError(w, err)
		return
	}

	err = db.Select(&output, query, args...)

	if err != nil {
		errorMessage := err.Error()

		if strings.Index(errorMessage, "syntax error") >= 0 {
			err = errors.New("Cannot analyze this query")
		}

		if strings.Index(errorMessage, "there is no parameter") >= 0 {
			err = errors.New("Cannot analyze query containing prepared statement")
		}

		utils.WriteJSONError(w, err)
		return
	}

	utils.WriteJSON(w, output)
}

var analyseExplainRegExp = regexp.MustCompile("(?i)^(explain analyse | explain)")
