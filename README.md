# PgMonk

PgMonk is a Postgres monitoring tool

**Objectives**

[] Show real-time queries execution
[] Show recent log output
[] Display any locks
[] Show slow queries, and missing indexes
[] Visualize requests/execution time/etc (graphs)

#### How to Use

Backend:

- Navigate to src/server
- Run `go get` to get all the dependencies
- Run `go run main.go` to start the server
  - The server will start on localhost:50000

Frontend:

- Navigate to src/frontend
- Run `yarn` or `npm install` to get all the dependencies
- Run `yarn start` or `npm run start` to start the frontend server

#### Current Stack

- Golang
- React
- Postgres
