package main

import (
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/controllers"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

//LogPath the local path to the Postgres log files
var LogPath = "C:\\PostgreSQL\\data\\logs\\pg11"

const connectionString = "application_name=PgMonk user=postgres password=test dbname=postgres sslmode=disable"

func main() {
	controllers.ConnectionString = connectionString

	r := mux.NewRouter()

	r.HandleFunc("/info", controllers.GetPostgresInfoController)
	r.HandleFunc("/logs", controllers.GetPostgresLogsController)

	fmt.Println("Starting on: http://localhost:5000")

	server := &http.Server{
		Handler:      r,
		Addr:         "localhost:5000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(server.ListenAndServe())
}
