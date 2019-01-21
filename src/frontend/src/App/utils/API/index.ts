import { IPostgresInfo } from "../Interfaces/IPostgresInfo";

class API {
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

  public getPostgresInfo = () => {
    return this.fetch<IPostgresInfo[]>("info", { method: "GET" });
  };
}

export const HTTP = new API();
