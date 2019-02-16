package middleware

import (
	"net/http"
)

const host = "*" // http://localhost:3000

//IsOriginValid cecks if requests come from a valid origin
func IsOriginValid(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if host != "*" && origin != host {
			http.Error(w, "Origin not allowed.", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
