import * as React from "react";
import { HTTP, API } from "../utils/API";

export function useFetcher<T>(
  fnc: (HTTP: API, args: any[]) => Promise<T>
): [
  T | null,
  (...args: any[]) => Promise<T>,
  boolean,
  React.Dispatch<React.SetStateAction<T | null>>
] {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<T | null>(null);

  function fetch(...args: any[]) {
    setLoading(true);

    return fnc(HTTP, args)
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

  return [data, fetch, isLoading, setData];
}
