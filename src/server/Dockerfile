FROM golang:latest AS build
RUN mkdir -p /go/src/github/com/ganderzz/pgmonk
WORKDIR /go/src/github/com/ganderzz/pgmonk
COPY . .
RUN go get
RUN go build -o main main.go

#FROM scratch
#COPY --from=build /go/src/github/com/ganderzz/pgmonk/main /

ENTRYPOINT ["./main", "-host", ""]

EXPOSE 5000