package controllers

import (
	"github/com/ganderzz/pgmonk/src/server/utils"
	"net/http"

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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer db.Close()

	var output []Database
	err = db.Select(&output,
		`select 
			table_catalog as TableCatalog, 
			table_schema as TableSchema, 
			table_name as TableName, 
			table_type as TableType
		FROM information_schema.tables
		ORDER BY table_type`)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, output)
}
