package middleware

import (
	"net/http"
)

//CorsMiddleware handle CORS functionality in all requests
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Credentials", "*")
		w.Header().Set("Access-Control-Expose-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			w.Write(nil)
			return
		}

		next.ServeHTTP(w, r)
	})
}
