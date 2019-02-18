export interface IPostgreLogData {
  date_time: Date;
  pid: number;
  message: string;
  status: string;
  meta: {
    user: string;
    db: string;
    app: string;
    client: string;
  };
}

export interface IPostgresLog {
  data: IPostgreLogData[];
  date_time: Date;
}
