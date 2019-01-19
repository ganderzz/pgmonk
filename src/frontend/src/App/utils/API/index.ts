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
          const contentLength = parseInt(
            response.headers.get("Content-Length")!,
            10
          );
          if (contentLength > 0) {
            return response.json();
          }

          return;
        }

        return Promise.reject(response.text());
      });
  }

  public getUsers = () => {
    return this.fetch<{ ID: number; Name: string }[]>("", { method: "GET" });
  };

  public createUser = (name: string) => {
    return this.fetch<void>("write", {
      method: "POST",
      body: JSON.stringify({
        Name: name,
      }),
    });
  };
}

export const HTTP = new API();
