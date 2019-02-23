import { IPostgresInfo } from "../Interfaces/IPostgresInfo";
import { IPostgresLog } from "../Interfaces/IPostgresLog";
import { IDatabase } from "../Interfaces/IDatabase";
import { ITable } from "../Interfaces/ITable";
import { IStatsStatement } from "../Interfaces/IStatsStatement";

export class API {
  private fetch: <T>(url: string, options?: RequestInit) => Promise<T>;

  constructor() {
    const baseURL = `http://localhost:5000/`;

    this.fetch = <T>(url: string, options?: RequestInit) =>
      fetch(baseURL + url, {
        mode: "cors",
        ...(options || {}),
      }).then(response => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject(response.text());
      });
  }

  private static toQueryString(query?: { [key: string]: any }): string {
    if (!query) {
      return "";
    }

    // ?key=val&key=secondval
    const queryString = Object.keys(query)
      .map(key => {
        const value = query[key];

        if (!value) {
          return "";
        }

        if (Array.isArray(value)) {
          return `${key}=${value.map(p => encodeURIComponent(p)).join(",")}`;
        }

        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");

    return `?${queryString}`;
  }

  public getPostgresInfo = (query?: { backend_type: string }) => {
    const queryString = API.toQueryString(query);

    return this.fetch<IPostgresInfo[]>(`info${queryString}`, { method: "GET" });
  };

  public getPostgresLogs = () => {
    return this.fetch<IPostgresLog[]>(`logs`, { method: "GET" });
  };

  public getDatabases = () => {
    return this.fetch<IDatabase[]>(`databases`, { method: "GET" });
  };

  public getTable = (name: string) => {
    return this.fetch<ITable>(`databases/${encodeURIComponent(name)}`, {
      method: "GET",
    });
  };

  public getStatsStatement = () => {
    return this.fetch<IStatsStatement[]>(`stats`, {
      method: "GET",
    });
  };
}

export const HTTP = new API();
