export interface IPostgresLog {
  DateTime: Date;
  Pid: number;
  Message: string;
  Status: string;
  Meta: {
    User: string;
    DB: string;
    App: string;
    Client: string;
  };
}
