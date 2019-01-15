package utils

import (
	"net/http"
	"testing"
)

func TestIsOriginValid(t *testing.T) {
	t.Run("IsOriginValid returns true on valid origin", func(t *testing.T) {
		h := http.Header{}
		h.Add("Origin", "localhost")

		response := IsOriginValid(nil, &http.Request{
			Header: h,
		})

		if !response {
			t.FailNow()
		}
	})

	t.Run("IsOriginValid returns false on ivalid origin", func(t *testing.T) {
		h := http.Header{}
		h.Add("Origin", "BROTHER!")

		response := IsOriginValid(nil, &http.Request{
			Header: h,
		})

		if response {
			t.FailNow()
		}
	})
}
