package main

import (
	"flag"
	"fmt"
	"github/com/ganderzz/pgmonk/src/server/controllers"
	"github/com/ganderzz/pgmonk/src/server/middleware"
	"github/com/ganderzz/pgmonk/src/server/utils"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	_ "github.com/lib/pq"
)

//LogPath the local path to the Postgres log files
var LogPath = "C:\\PostgreSQL\\data\\logs\\pg11"

const serverPath = "localhost:5000"

func main() {
	userArg := flag.String("user", "postgres", "Database user")
	passwordArg := flag.String("password", "test", "Database password")
	databaseArg := flag.String("db", "postgres", "Database")
	hostArg := flag.String("host", "localhost", "Host")

	flag.Parse()

	controllers.ConnectionString = utils.MakeConnectionString(*userArg, *passwordArg, *databaseArg, *hostArg)

	r := mux.NewRouter()

	r.HandleFunc("/info", controllers.HandleGetInfo).Methods("GET")
	r.HandleFunc("/logs", controllers.HandleGetLogs).Methods("GET")
	r.HandleFunc("/databases", controllers.HandleGetDatabases).Methods("GET")
	r.HandleFunc("/databases/{name}", controllers.HandleGetDatabase).Methods("GET")
	r.HandleFunc("/stats", controllers.HandleStatStatements).Methods("GET")

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
