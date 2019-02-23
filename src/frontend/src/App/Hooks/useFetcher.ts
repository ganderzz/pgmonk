import * as React from "react";
import { HTTP, API } from "../utils/API";

export function useFetcher<T>(
  fnc: (HTTP: API) => Promise<T>
): [T | null, () => Promise<T>, boolean] {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<T | null>(null);

  function fetch() {
    setLoading(true);

    return fnc(HTTP)
      .then(response => {
        setLoading(false);
        setData(response);

        return response;
      })
      .catch(response => {
        setLoading(false);

        return Promise.reject(response);
      });
  }

  return [data, fetch, isLoading];
}
