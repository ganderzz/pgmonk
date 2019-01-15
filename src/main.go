package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github/com/ganderzz/pgmonk/src/utils"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

const connStr = "user=postgres password=test dbname=postgres sslmode=disable"

//Person .
type Person struct {
	ID   int32
	Name string
}

//ConvertBytesToPerson .
func ConvertBytesToPerson(data []byte) (*Person, error) {
	obj := &Person{}

	err := json.Unmarshal(data, obj)
	if err != nil {
		return nil, err
	}

	return obj, nil
}

func scanDB(rows *sql.Rows) ([]Person, error) {
	var p []Person
	for rows.Next() {
		var tempP Person

		err := rows.Scan(&tempP.ID, &tempP.Name)
		if err != nil {
			return p, err
		}

		p = append(p, tempP)
	}

	return p, nil
}

func handleGetUsers(writer http.ResponseWriter, reader *http.Request) {
	if !utils.IsOriginValid(writer, reader) {
		return
	}

	if reader.Method != "GET" {
		http.Error(writer, "Method not GET", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return
	}

	defer db.Close()

	rows, err := db.Query("SELECT id, name FROM users")

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	p, err := scanDB(rows)

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}

	utils.WriteJSON(writer, p)
}

func handleWriteUsers(writer http.ResponseWriter, reader *http.Request) {
	if !utils.IsOriginValid(writer, reader) {
		return
	}

	if reader.Method != "POST" {
		http.Error(writer, "Method not POST", http.StatusBadRequest)
		return
	}

	body, err := ioutil.ReadAll(reader.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(writer, "Can't read body", http.StatusBadRequest)
		return
	}

	json, err := ConvertBytesToPerson(body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(writer, "Can't read body", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return
	}

	defer db.Close()

	_, err = db.Query("INSERT INTO users (name) VALUES ($1)", json.Name)

	if err != nil {
		fmt.Printf("ERROR: %s", err.Error())
		return
	}
}

func main() {
	http.HandleFunc("/", handleGetUsers)
	http.HandleFunc("/write", handleWriteUsers)

	fmt.Println("Starting on: http://localhost:5000")

	http.ListenAndServe(":5000", nil)
}
