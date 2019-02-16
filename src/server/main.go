package main

import (
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/controllers"
	"github/com/ganderzz/pgmonk/src/server/middleware"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

//LogPath the local path to the Postgres log files
var LogPath = "C:\\PostgreSQL\\data\\logs\\pg11"

const serverPath = "localhost:5000"
const connectionString = "application_name=PgMonk user=postgres password=test dbname=postgres sslmode=disable"

func main() {
	controllers.ConnectionString = connectionString

	r := mux.NewRouter()

	r.HandleFunc("/info", controllers.HandleGetInfo).Methods("GET")
	r.HandleFunc("/logs", controllers.HandleGetLogs).Methods("GET")

	r.Use(middleware.IsOriginValid)
	r.Use(middleware.CorsMiddleware)

	server := &http.Server{
		Handler:      r,
		Addr:         serverPath,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	fmt.Println("Starting on: http://" + serverPath)

	log.Fatal(server.ListenAndServe())
}
