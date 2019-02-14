package main

import (
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/controllers"
	"net/http"

	_ "github.com/lib/pq"
)

//LogPath the local path to the Postgres log files
var LogPath = "C:\\PostgreSQL\\data\\logs\\pg11"

const connectionString = "application_name=PgMonk user=postgres password=test dbname=postgres sslmode=disable"

func main() {
	controllers.ConnectionString = connectionString
	http.HandleFunc("/info", controllers.GetPostgresInfoController)
	http.HandleFunc("/logs", controllers.GetPostgresLogsController)

	fmt.Println("Starting on: http://localhost:5000")

	http.ListenAndServe(":5000", nil)
}
